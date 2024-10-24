import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { NonRetryableError } from 'cloudflare:workflows';

export type InteractionParams = {
	userId: string;
	punId: string;
	cf: CfProperties;
	interactionType: 'like' | 'detail';
};

export class InteractionWorkfow extends WorkflowEntrypoint<Env, InteractionParams> {
	async run(event: WorkflowEvent<InteractionParams>, step: WorkflowStep) {
		const { userId, punId, interactionType, cf } = event.payload;
		let userFieldName;
		if (userId.startsWith('anon-')) {
			userFieldName = 'session_id';
			// TODO: Bot detection using cf (NonRetryableError)
			await step.do('ensure-session-exists', async () => {
				const response: D1Result<{ counter: number }> = await this.env.DB.prepare(
					'SELECT count(*) AS counter FROM anonymous_sessions WHERE session_id=?'
				)
					.bind(userId)
					.run();
				if (response.results[0].counter === 0) {
					await this.env.DB.prepare('INSERT INTO anonymous_sessions (session_id) VALUES (?)').bind(userId).run();
				}
			});
		} else {
			userFieldName = 'user_id';
			await step.do('ensure-user-exists', async () => {
				const response: D1Result<{ counter: number }> = await this.env.DB.prepare('SELECT count(*) AS counter FROM users WHERE user_id=?')
					.bind(userId)
					.run();
				if (response.results[0].counter === 0) {
					throw new NonRetryableError(`User ${userId} does not exist`);
				}
			});
		}
		await step.do('record-valid-interaction', async () => {
			await this.env.DB.prepare(`INSERT INTO pun_interactions (pun_id, ${userFieldName}, interaction_type) VALUES (?, ?, ?)`)
				.bind(punId, userId, interactionType)
				.run();
			return true;
		});
	}
}

