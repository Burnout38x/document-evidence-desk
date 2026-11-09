# Corpus and retrieval evidence

Reviewed 2026-11-09. Owned implementation: `src/data/documents.js`, `src/lib/retrieval.js`, `src/data/evaluation.json`, `tests/retrieval.test.js`, `tests/evaluate.js`.

## Scope and provenance

The product contains 15 short original reading notes across five public technical documents. Notes are paraphrases, not direct excerpts, complete copies, live crawls, or original author quotations. Each note retains its document's canonical URL. `updated` stores this review date, not the publisher's modification date. The corpus was researched with the web tool on this date; no credentials, user documents, or provider calls were used.

| Document ID | Primary source | Claims reviewed |
| --- | --- | --- |
| http-cache | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching | no-cache vs no-store, private responses, ETag validation and 304 |
| http-idempotency | https://developer.mozilla.org/en-US/docs/Glossary/Idempotent | intended repeated effect, methods, retry assumptions, potentially different responses |
| fetch-errors | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch | HTTP errors vs promise rejection, AbortController, one-use body streams and clone |
| accessible-labels | https://www.w3.org/WAI/tutorials/forms/labels/ | explicit for/id association, enlarged activation area, accessible name alternatives |
| vite-secrets | https://vite.dev/guide/env-and-mode | VITE_ client exposure, server-only secrets, string conversion |

The corpus averages fewer than 150 words derived per source, below the retrieved sources' 200-word summary limits. No scraped page bulk is republished. Sources remain the authoritative material; notes deliberately omit advanced and framework-version-specific edge cases. This corpus is a recruiter demo about reliable web apps, not comprehensive technical advice.

## Architecture choice

Chosen default: deterministic lexical ranking with term normalization, inverse-frequency weighting and stronger heading matches. Query coverage plus a technical anchor requirement filters weak matches. Return at most four bounded passages; numeric scores are ranking values, not confidence probabilities. Filters apply before ranking; an empty selection returns no results. No embeddings, vector database, semantic model or AI answer generation occurs in this module.

Reason: a genuinely usable local mode can be built without keys, while the server can reuse the exact same corpus/retrieval boundary later. Consequence: unfamiliar paraphrases, typos, mixed intent and unsupported subquestions may be missed or matched imperfectly. Retrieval success does not establish that evidence answers every part of a question. Revisit with a larger independently labeled dataset before claiming general retrieval quality.

## Actual checks

Commands run from project root:

- `node --test tests/retrieval.test.js`: exit 0, 5 tests passed. Covered normalization, unsupported/empty/malformed questions, source filter isolation, empty/unknown scopes, repeatability, bounded results, citation traceability, invalid input types.
- `node tests/evaluate.js`: latest exit 0, 20/22 fixtures passed; expected passage in top four 14/15; abstention on unrelated prompts 6/7. Full questions, expected IDs, actual IDs and run time are in `src/data/evaluation.json`.

Initial evaluation: 19/20. The question “How does a label help checkbox clicking?” returned insufficient evidence because plural checkboxes and clickable/clicking were not normalized together. Added checkbox and click normalization; retained that fixture; reran the entire unit suite and evaluation. That 20/20 was a development regression result after adjustment, not a held-out benchmark. A later independent read-only review added two probes without tuning retrieval: “What does 404 mean?” expects fetch-status but abstains; “What is the private key of Bitcoin?” expects abstention but matches vite-server. The current report retains these two failures (20/22 total), exposing narrow lexical coverage and ambiguous keyword matches. Retrieval hit rate is 14/15 (93.33%) and abstention accuracy is 6/7 (85.71%). These two review probes are not a statistically independent benchmark; they simply make known gaps visible. The evaluation command records results and exits normally even when quality cases fail; unit tests separately enforce core correctness and isolation.

Initial Node runs emitted MODULE_TYPELESS_PACKAGE_JSON warnings before the root-owned package.json existed; execution still completed. The root owns package metadata and full build verification.

No AI model quality, provider response, production deployment, live source freshness after this review, accessibility conformance, or recruiter hiring outcome is claimed by these tests. Screen and integration verification belong to the integrator.

## Suggested first-run questions

- What is the difference between no-cache and no-store?
- Is it safe to retry a POST request?
- Why does fetch not reject a 404?
- How do I label a form input?
- Can I put an API key in a VITE variable?

## Authority audit

Public technical documentation and a maximum $5 overall AI budget are user requirements. Topic selection within that category, five-source scope, lexical ranking, relevance thresholds, and test fixtures are agent defaults. The source-derived technical statements are attributed above. Metrics derive from executing the committed retrieval against the explicit development fixtures. No live provider spending took place.
