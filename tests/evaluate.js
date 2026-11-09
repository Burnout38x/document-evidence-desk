import { writeFileSync } from 'node:fs';
import { searchDocuments } from '../src/lib/retrieval.js';

// Small development regression set. It is not a held-out benchmark.
const fixtures = [
 ['What is the difference between no-cache and no-store?', 'cache-validation'],
 ['Can shared caches store personalized private responses?', 'cache-private'],
 ['How does ETag validation return 304?', 'cache-etag'],
 ['Is it safe to retry a POST request?', 'idempotency-retry'],
 ['Are PUT and DELETE idempotent methods?', 'idempotency-methods'],
 ['Why does fetch not reject a 404?', 'fetch-status'],
 ['How do I cancel fetch with AbortController?', 'fetch-abort'],
 ['Can I read a fetch response body twice?', 'fetch-body'],
 ['How do I label a form input?', 'labels-explicit'],
 ['How does a label help checkbox clicking?', 'labels-click'],
 ['When should I use aria-label?', 'labels-hidden'],
 ['Can I put an API key in a VITE variable?', 'vite-client'],
 ['Where should private API keys live?', 'vite-server'],
 ['Are Vite environment variables strings?', 'vite-types'],
 ['What is the weather in Tokyo?', null],
 ['How can I train a neural network?', null],
 ['What is the best pizza recipe?', null],
 ['Which database should my server use for medical records?', null],
 ['What is the price of Bitcoin?', null],
 ['How do I configure Kubernetes autoscaling?', null],
 // Independent read-only review probes, retained without tuning retrieval.
 ['What does 404 mean?', 'fetch-status'],
 ['What is the private key of Bitcoin?', null],
];
const cases=fixtures.map(([question,expected])=>{
 const result=searchDocuments(question);
 const actual=result.results.map(p=>p.id);
 return {question,expected:expected || 'insufficient',passed:expected ? actual.includes(expected) : result.status==='insufficient',actual};
});
const positive=cases.filter(c=>c.expected!=='insufficient');
const negative=cases.filter(c=>c.expected==='insufficient');
const report={generatedAt:new Date().toISOString(),method:'Deterministic lexical retrieval over curated reading notes. 22 fixtures: 20 development questions and 2 independent review probes added without retrieval tuning. Hit means expected passage appears in the top 4. Not a held-out benchmark or an AI answer-quality evaluation.',total:cases.length,passed:cases.filter(c=>c.passed).length,metrics:{retrievalHitRate:positive.filter(c=>c.passed).length/positive.length,abstentionAccuracy:negative.filter(c=>c.passed).length/negative.length},cases};
writeFileSync(new URL('../src/data/evaluation.json', import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
// Evaluation records observed quality, including known failures; it is not a perfect-score gate.
// Core behavior and isolation guarantees are asserted in retrieval.test.js.
