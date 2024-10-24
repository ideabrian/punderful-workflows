## Setup

### D1

This uses a D1 database, so you need to create it

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