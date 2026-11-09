// Original, bounded reading notes based on the linked public documentation.
// These are paraphrases, not verbatim source excerpts or complete documentation.
export const documents = [
  {
    id: 'http-cache', title: 'HTTP caching', topic: 'Performance',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching',
    updated: '2026-11-09', summary: 'Validation, storage, and private responses.',
    passages: [
      { id: 'cache-validation', heading: 'no-cache versus no-store', text: 'Cache-Control: no-cache permits storage but requires validation before a cached response is reused. Cache-Control: no-store prevents storing the response. It does not remove responses that were already cached.' },
      { id: 'cache-private', heading: 'Keep personalized responses private', text: 'Use the private Cache-Control directive for personalized content that a shared cache must not store. A private browser cache may still store it. Combine private with no-cache when reuse also needs validation.' },
      { id: 'cache-etag', heading: 'Validate with an ETag', text: 'An ETag identifies a representation for conditional requests. When the representation has not changed, validation can return 304 Not Modified rather than retransmitting the response body.' },
    ],
  },
  {
    id: 'http-idempotency', title: 'HTTP idempotency', topic: 'Reliability',
    url: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
    updated: '2026-11-09', summary: 'Repeated requests and safe retry assumptions.',
    passages: [
      { id: 'idempotency-meaning', heading: 'Repeated requests, one intended effect', text: 'An idempotent operation has the same intended server effect when an identical request is repeated. This describes the effect, not a promise that every response or status code will be identical.' },
      { id: 'idempotency-methods', heading: 'Which HTTP methods are idempotent?', text: 'HTTP defines safe methods, including GET, as idempotent. PUT and DELETE are also idempotent by their specified semantics. POST and PATCH do not carry that guarantee.' },
      { id: 'idempotency-retry', heading: 'Do not assume POST is safe to retry', text: 'An idempotent request can be retried when delivery is uncertain without adding another intended effect. Servers must implement those semantics correctly. Repeating POST is not automatically safe merely because the first response was lost.' },
    ],
  },
  {
    id: 'fetch-errors', title: 'Using the Fetch API', topic: 'Browser APIs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
    updated: '2026-11-09', summary: 'HTTP failures, cancellation, and response bodies.',
    passages: [
      { id: 'fetch-status', heading: 'A 404 does not reject fetch', text: 'fetch resolves to a Response when a server returns an HTTP error such as 404. Check response.ok or response.status explicitly. Network failures can reject the promise; HTTP error statuses alone do not.' },
      { id: 'fetch-abort', heading: 'Cancel a request', text: 'Create an AbortController and pass its signal to fetch. Calling abort cancels the request and causes rejection with AbortError. Handle cancellation separately when the interface needs different feedback from other failures.' },
      { id: 'fetch-body', heading: 'Read a response body once', text: 'Response bodies are streams. Reading with json or text consumes the body, so the same response cannot normally be read again. Clone a response before consuming it if two reads are needed.' },
    ],
  },
  {
    id: 'accessible-labels', title: 'Labeling form controls', topic: 'Accessibility',
    url: 'https://www.w3.org/WAI/tutorials/forms/labels/',
    updated: '2026-11-09', summary: 'Names and associations for usable forms.',
    passages: [
      { id: 'labels-explicit', heading: 'Connect a label to its input', text: 'Give form controls descriptive labels. An explicit HTML label connects to an input when the label’s for attribute matches the control’s id. This association helps assistive technology identify the control.' },
      { id: 'labels-click', heading: 'Labels make controls easier to activate', text: 'An associated label expands the clickable area of its control. This is especially useful for small targets such as checkboxes and radio buttons, and helps users understand what they are selecting.' },
      { id: 'labels-hidden', heading: 'Accessible names when text is hidden', text: 'A control still needs an accessible name when its purpose is visually apparent. Depending on the context, use a visually hidden label, aria-label, or aria-labelledby. Prefer a visible label whenever practical.' },
    ],
  },
  {
    id: 'vite-secrets', title: 'Vite environment variables', topic: 'Security',
    url: 'https://vite.dev/guide/env-and-mode',
    updated: '2026-11-09', summary: 'Client exposure and server-side secrets.',
    passages: [
      { id: 'vite-client', heading: 'VITE variables are public client values', text: 'Vite exposes variables prefixed VITE_ in client-side code. Their values are replaced during the build and become part of the delivered bundle. A VITE_ variable is not a safe place for an API key or other secret.' },
      { id: 'vite-server', heading: 'Keep API keys on the server', text: 'For production, access sensitive credentials through a backend or serverless function instead of embedding them in the browser bundle. Do not put private API keys in VITE_ variables.' },
      { id: 'vite-types', heading: 'Environment values arrive as strings', text: 'User-defined environment variables exposed by Vite are strings. Convert values deliberately when the application needs a number or boolean. Built-in constants such as DEV and PROD have their documented types.' },
    ],
  },
];
