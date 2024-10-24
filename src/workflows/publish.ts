import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { NonRetryableError } from 'cloudflare:workflows';
import OpenAI from 'openai';


export type PublishParams = {
	punId: string;
	pun: string;
};


export class PublishWorkflow extends WorkflowEntrypoint<Env, PublishParams> {
	async run(event: WorkflowEvent<PublishParams>, step: WorkflowStep) {
		const { pun, punId } = event.payload;
		// step: [OPTIONAL] Moderate using OpenAI's free moderation API
		if (this.env.OPENAI_API_KEY !== undefined) {
			await step.do('content-moderation', async () => {
				const openai = new OpenAI({ apiKey: this.env.OPENAI_API_KEY });

				const moderation = await openai.moderations.create({
					model: 'omni-moderation-latest',
					input: pun,
				});
				if (moderation.results[0].flagged) {
					console.warn(`Pun flagged: ${JSON.stringify(moderation)}`);
					await this.env.DB.prepare(`UPDATE puns SET status=? WHERE id=?`).bind('flagged', punId).run();
					throw new NonRetryableError(`Pun ${punId} failed moderation`);
				}
				return true;
			});
		} else {
			console.warn('OPENAI_API_KEY is not present in your environment, set it to enable moderation');
		}
		// step: Create embedding for indexing
		const punEmbedding = await step.do('create-pun-embedding', async () => {
			const results = await this.env.AI.run('@cf/baai/bge-large-en-v1.5', {
				text: pun,
			});
			return results.data[0];
		});
		// step: Categorize
		const categories = await step.do('categorize-pun', async () => {
			const results = await this.env.AI.run(
				'@cf/meta/llama-3.1-8b-instruct',
				{
					messages: [
						{
							role: 'system',
							content: `You help categorize puns for people to search for later.

							The user is going to give you a pun and your job is to list the most relevant categories for the pun, based on the content of the pun.

							Do not include words about pun in general, focus on what the content is about. For instance don't return "word play" or "pun" as a category.

							Return only the categories, comma separated. Do not include a preamble or introudction, just the categories.
							`,
						},
						{ role: 'user', content: pun },
					],
				},
				{
					gateway: {
						id: 'punderful',
					},
				}
			);
            // @ts-ignore
			return results.response;
		});
		// step: Index categories
		const categoriesEmbedding = await step.do('create-categories-embedding', async () => {
			const results = await this.env.AI.run('@cf/baai/bge-large-en-v1.5', {
				text: categories,
			});
			return results.data[0];
		});
		// step: Add to Vectorize
		await step.do('add-embeddings-to-vector-store', async () => {
			await this.env.VECTORIZE.upsert([
				{
					id: `content-${punId}`,
					values: punEmbedding,
					namespace: 'content',
					metadata: {
						punId,
						pun,
						categories,
					},
				},
			]);
			await this.env.VECTORIZE.upsert([
				{
					id: `categories-${punId}`,
					values: categoriesEmbedding,
					namespace: 'categories',
					metadata: {
						punId,
						pun,
						categories,
					},
				},
			]);
		});
		// Step: Update the db
		await step.do('update-status-to-published', async () => {
			const results = await this.env.DB.prepare(`UPDATE puns SET status=? WHERE id=?`).bind('published', punId).run();
		});
	}
}
