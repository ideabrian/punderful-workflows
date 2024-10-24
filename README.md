# Punderful

Punderful is a #BuildInPublic project that collects puns from everyone and helps them find them ones that make the chuckle.

It makes use of [Cloudflare Stack](https://www.youtube.com/watch?v=FH5-m0aiO5g), but most importantly focussing on the new kid on the block [Workflows](https://developers.cloudflare.com/workflows).


## Learn More



## Setup

You should be able to create all of this on the free tier. Let me know if you run into any problems

### D1

This uses a D1 database, so you need to create one

```bash
npx wrangler d1 create punderful
```

Copy and Paste the returned value and replace it in [wrangler.toml](./wrangler.toml)

*Dev mode*

```bash
npx wrangler d1 migrations apply punderful
```

*Production*

```bash
npx wrangler d1 migrations apply punderful --remote
```

### Vectorize

Create the index with the settings of embedding model we are going to use

```bash
npx wrangler@beta vectorize create punderful --preset "@cf/baai/bge-large-en-v1.5"
```

(This is already in wrangler.toml)

### KV

Create the namespace

```bash
npx wrangler@workflows kv namespace create LEADERBOARD
```

Copy and Paste the returned value and replace it in [wrangler.toml](./wrangler.toml)

### Optional: OpenAI

npx wrangler secret put OPENAI_API_KEY 