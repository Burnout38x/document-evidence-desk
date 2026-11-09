# Document Evidence Desk

A small, inspectable research app by James Akintunde. Ask a web-engineering question, inspect matching technical reading notes, open the original documentation, and save a Markdown research note.

## What works without credentials

- Five attributed public technical sources with 15 curated paraphrases.
- Local deterministic keyword retrieval, source filters and insufficient-evidence state.
- Source inspector and expandable reading-note library.
- A reproducible evaluation dashboard exposing both passing and failing cases.
- Responsive interface, keyboard navigation, reduced motion, and no browser analytics.

**Evidence mode does not generate AI answers, use embeddings, browse the live web, or search full documentation.** It searches a deliberately small curated corpus. This is not a claim of a complete semantic RAG system. Notes may omit context; linked original documentation remains authoritative. Recent questions exist only in page memory.

## Run

Node 22 or later:

```sh
npm ci
npm run dev
npm test
npm run evaluate
npm run build
npm run preview
```

The Vite dev/preview middleware uses the same native API handler as Vercel. No key is needed. `npm test` includes a real localhost HTTP integration test; the execution environment must allow binding a local port.

## Evaluation

22 author-written development and review fixtures: 20 pass, 2 fail. Retrieval hit rate 14/15 (93.3%); abstention accuracy 6/7 (85.7%). The short query “What does 404 mean?” misses relevant fetch evidence. A Bitcoin private-key query erroneously matches API-key notes. These limitations are deliberately visible, not tuned away after review. This is not a held-out benchmark and does not measure generated answer quality. `npm run evaluate` regenerates `src/data/evaluation.json` and reports observed quality; unit tests separately enforce core behavior.

## Optional AI answers — connect later

`api/answer.js` is a server-only OpenAI integration. The browser asks the server whether the feature is enabled. When explicitly selected, AI mode sends the user's question and retrieved public notes to OpenAI. Server retrieval ignores any client-supplied evidence. Model output is structured, citation IDs are allowlisted, and failures leave local evidence search usable. Valid citation IDs do not prove semantic correctness.

AI remains **disabled** until an owner configures the provider and persistent budget store. See [provider setup and budget design](work/provider.md). Requirements:

1. A dedicated OpenAI key, kept only in server environment variables.
2. A persistent Upstash Redis database and server-only REST credentials.
3. Initialize the one lifetime budget ledger exactly once with `SET evidence-desk:v1:reserved-usd-cents 0 NX`. Same ledger across development/preview/production; never reset it to replenish credit.
4. Review current model pricing, account permissions, infrastructure cost, and the conservative bound before setting `EVIDENCE_AI_ENABLED=true`.
5. Run a live smoke test and adversarial answer evaluation. These have **not** been performed because credentials are deferred.

The endpoint reserves one cent atomically before each call, caps total reservations at $5, limits global requests to eight/minute, and retains reservations after errors. It fails closed without a permanent valid ledger. There are no paid requests during the initial build. The allowance does not cover unrelated key usage, infrastructure fees, owner resets, or provider pricing changes. Only use free infrastructure unless additional spending is explicitly approved. Pricing-review expiry disables AI on December 9, 2026 UTC until a fresh code/pricing review.

## Deploy to Vercel

Import `Burnout38x/document-evidence-desk`, preset **Vite**, root `./`, build `npm run build`, output `dist`. No environment variables are needed for evidence mode. Vercel discovers the Node function in `api/answer.js`. Add server credentials later, following the provider guide. No account/login/database is needed for local evidence mode.

## Architecture and maintenance

- `src/App.jsx`: research desk, library, evaluation and source inspection.
- `src/data/documents.js`: curated corpus; `updated` is the source review date.
- `src/lib/retrieval.js`: local lexical retrieval, shared with server.
- `api/answer.js`: bounded optional synthesis with durable cost reservation.
- `tests/`: retrieval tests, mocked provider tests, real local HTTP integration and evaluation fixtures.
- `work/research.md`: corpus provenance and known limitations.
- `work/release.md`: observed checks and release limitations.

Update the corpus and attribution together, rerun tests/evaluation and inspect changed results before deploying. Disable AI with `EVIDENCE_AI_ENABLED=false` if provider/ledger health is uncertain. Roll back by redeploying the last known-good Git commit. Preserve the budget ledger during rollbacks. This app keeps no user documents; there is no account database to back up. No guarantees of medical, legal or security advice, complete WCAG conformance, or production-scale reliability are made.

Design: warm ivory, deep forest ink, sage surfaces and restrained brass accents. Rounded forms and purposeful hover motion match James's portfolio preferences. Native controls keep the interaction small and understandable. Fonts are self-hosted; no image-generation service or paid media was used.
