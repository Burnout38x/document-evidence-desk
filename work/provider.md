# Optional AI integration — 2026-11-09

Implemented `api/answer.js` with native Node fetch, no additional dependencies. The live provider has NOT been called. No credentials were accessed and no money was spent. The app remains useful through local evidence search without these services.

## Provider contract

- `GET /api/answer` returns only `{available:boolean}`. True means server configuration and pricing-review date permit an attempt, not a health-check guarantee.
- `POST /api/answer`, JSON `{question, documentIds?}`. Question 3–600 characters, UTF-8 ≤1,800 bytes. IDs are bounded strings; client-supplied evidence and unknown fields are rejected. Retrieval happens independently on the server.
- Success: `{mode:'ai', supported, answer, citations:[passageId], model}`. No evidence returns `{mode:'evidence',supported:false,...}` without a provider call.
- Unsupported methods 405; malformed input 400; content type 415; unavailable configuration/ledger 503; exhausted budget or global rate limit 429; provider/shape/citation failure 502. Errors never include provider raw messages or secrets.
- UI must render answer as text, not HTML. Citations are validated against retrieved passage IDs; this validates provenance identifiers, NOT semantic correctness. Actual model groundedness evaluation is pending.

## Enable later

Set these server-side environment variables in the Vercel project. Never use a `VITE_` prefix or put them in browser storage/source control:

```
EVIDENCE_AI_ENABLED=true
OPENAI_API_KEY=<dedicated project key>
UPSTASH_REDIS_REST_URL=https://<permanent-database>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<write-capable REST token>
```

Use a persistent Upstash database with no eviction of budget state. In its console, initialize exactly once:

```
SET evidence-desk:v1:reserved-usd-cents 0 NX
```

`NX` preserves existing credit usage. Never delete, reset, expire, rename, or move this key to create extra credit. Use the SAME permanent database for development, previews and production so their usage shares one allowance. If calls were made outside this endpoint, account for that spend by increasing the stored reserved cents BEFORE activation; this endpoint cannot track external usage of the API key. A dedicated project/key reduces that risk. No Redis service was provisioned; infrastructure billing must be checked separately before activation. Choose a suitable free tier if available, or obtain approval for paid infrastructure rather than drawing from the AI allowance implicitly.

`EVIDENCE_AI_ENABLED=false` is the kill switch. Code automatically disables AI on December 9, 2026 UTC, requiring a new pricing/model review before extending that date. Do not simply change the date without reviewing cost bounds.

## Lifetime allowance and abuse controls

One atomic Redis EVAL checks the persistent integer cents ledger, rejects missing/expiring/corrupt state, enforces a shared 8-attempt/60-second rate window, and reserves 1 cent before each model call. Hardcoded lifetime ceiling is 500 cents. No refunds: provider failures/timeouts still consume the reserved allowance, preserving a conservative upper bound. There is no in-process counter or automatic daily reset. Deployment restarts do not reset credit. If the ledger is unavailable, paid calls do not occur.

The model is fixed to `gpt-6-luna`, standard tier, one completion, no tools, no attachments or browsing. Request serialized UTF-8 size ≤12,000 bytes, generation ≤800 tokens, reasoning disabled. A conservative input estimate of 16,000 tokens allows space for message/schema formatting. At the reviewed prices, even assuming all input paid at the 12-hour cache-write rate ($0.25/M), the bound is $0.004 input + $0.0004 output = $0.0044 per attempt, below the $0.01 reservation. Thus at most 500 permitted attempts conservatively reserve $5. This is an application safeguard, not a guarantee against owner resets, database eviction, provider price changes, unrelated project charges, or third-party infrastructure charges. Reconfirm price/model availability and run a live smoke test before enabling.

Redis requests time out after 4 seconds; provider requests after 20 seconds; redirects are rejected; there are no automatic retries. Timeout-after-reservation can consume credit without returning an answer, deliberately favoring budget safety. The global rate limit can be exhausted by any visitor; it is a small public demo, not an authenticated multi-tenant service.

## Trust and retention

Question and curated notes are serialized as untrusted data separate from developer instructions. No tools or secrets are included in the model prompt. Responses must match strict JSON schema and pass local shape/allowed-citation validation. Unsupported model outputs are replaced with a fixed abstention. Prompt instructions do not prove resistance to every injection; live adversarial evaluation remains unverified. Server does not log questions or save responses; Redis holds only counters. OpenAI receives the user's question and relevant curated public notes only when AI is explicitly requested. `store:false` is sent; provider-level retention is governed by the selected account policy.

## Primary references reviewed

- [OpenAI GPT-6 Luna model](https://developers.openai.com/api/docs/models/gpt-6-luna): supports Chat Completions, structured output, and reasoning effort `none`.
- [OpenAI pricing](https://developers.openai.com/api/docs/pricing): standard short-context GPT-6 Luna input $0.10/M, output $0.50/M, cache-write 12-hour $0.25/M, as reviewed Nov 9, 2026. No token tools enabled.
- [Chat Completions create](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create): generation bound includes visible/reasoning tokens; strict JSON schema, `store`, and standard service-tier settings.
- [Upstash REST](https://upstash.com/docs/redis/features/restapi) and [EVAL](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval): JSON command body and server-side Lua. Ordinary pipelining is not atomic; this implementation uses a single EVAL.

## Verification evidence

`node --test tests/api.test.js`: 14 passed, 0 failed on Node v24.18.0. Tests exercise disabled/malformed config, method/content/input bounds, unsupported-question abstention, server retrieval filters, successful validated response, missing/exhausted/rate-limited ledger, Redis failure, provider failure, citation/shape checks, oversized context, prompt boundary, pricing expiry, and 20 concurrent requests against one remaining reservation. Concurrent transport uses an atomic mock Redis boundary, NOT a live Redis server. No claim is made that Lua execution or production credentials were tested. The actual Lua and OpenAI integration need the later live smoke test. Initial test-file syntax error was fixed before the passing run.

### Native HTTP adapter verification

The handler now supports both Vercel `res.status().json()` and native Node `res.statusCode`/`res.end()`. For native incoming requests, it reads at most 4,096 bytes before JSON parsing, rejects declared oversized bodies immediately, caps chunked bodies while reading, and times out incomplete bodies after three seconds. Parsed Vercel bodies still pass the same field validation.

`node --test tests/api.test.js`: **15 passed, 0 failed** after adding an actual temporary localhost HTTP server test. Verified GET, no-key POST, invalid JSON POST, valid unsupported-question POST, and oversized POST through real HTTP with no external calls. Initial sandbox run could not bind localhost (`EPERM`); rerun with approved local-server permission passed. `command -v redis-server` and `command -v redis-cli` found no installation, so no local Redis execution was possible and no service was installed. Lua atomicity remains an externally documented contract plus mocked-boundary test, not live verification.
