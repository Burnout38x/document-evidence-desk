import { documents } from '../data/documents.js';

const stopWords = new Set('a an the and or but to of in on for from with without as at by is are was were be been being it its this that these those i my me we our you your they their do does did can could would should will shall may might how what which when where why who not no if then than also into about please tell explain need use using used want know make get'.split(' '));
const canonical = new Map([
  ['caching', 'cache'], ['cached', 'cache'], ['caches', 'cache'], ['revalidation', 'validation'], ['validate', 'validation'], ['revalidate', 'validation'],
  ['retrying', 'retry'], ['retries', 'retry'], ['retried', 'retry'], ['idempotency', 'idempotent'], ['repeated', 'repeat'], ['repeating', 'repeat'],
  ['fetching', 'fetch'], ['rejects', 'reject'], ['rejection', 'reject'], ['rejected', 'reject'], ['failed', 'failure'], ['failures', 'failure'],
  ['cancellation', 'cancel'], ['cancelled', 'cancel'], ['aborting', 'abort'], ['aborted', 'abort'],
  ['checkboxes', 'checkbox'], ['clicking', 'click'], ['clickable', 'click'], ['helps', 'help'], ['labels', 'label'], ['labeling', 'label'], ['labelling', 'label'], ['inputs', 'input'], ['controls', 'control'], ['forms', 'form'],
  ['keys', 'key'], ['secrets', 'secret'], ['credentials', 'credential'], ['variables', 'variable'], ['values', 'value'],
  ['responses', 'response'], ['requests', 'request'], ['methods', 'method'], ['strings', 'string'], ['bodies', 'body'], ['reading', 'read'], ['reads', 'read'],
]);
function tokenize(value) {
  return [...new Set((value.toLowerCase().match(/[a-z0-9]+(?:[-_][a-z0-9]+)*/g) || [])
    .filter(word => !stopWords.has(word))
    .map(word => canonical.get(word) || word))];
}
const indexed = documents.flatMap(doc => doc.passages.map(p => ({
  ...p, documentId: doc.id, documentTitle: doc.title, url: doc.url,
  bodyTerms: tokenize(p.text), headingTerms: tokenize(p.heading), titleTerms: tokenize(doc.title),
})));
const docFrequency = new Map();
for (const passage of indexed) {
  for (const term of new Set([...passage.bodyTerms, ...passage.headingTerms, ...passage.titleTerms])) {
    docFrequency.set(term, (docFrequency.get(term) || 0) + 1);
  }
}
const anchors = new Set('cache no-cache no-store cache-control private etag 304 idempotent post patch put delete retry fetch 404 response.ok response.status abort abortcontroller aborterror json clone label aria-label aria-labelledby checkbox checkboxes vite vite_ secret credential environment'.split(' '));

/** Small-corpus lexical retrieval, not semantic search or a confidence estimate. */
export function searchDocuments(question, { documentIds } = {}) {
  const terms = typeof question === 'string' ? tokenize(question.slice(0, 1200)) : [];
  const empty = { status: 'insufficient', results: [], terms };
  if (!terms.length || (documentIds !== undefined && !Array.isArray(documentIds))) return empty;
  const scope = documentIds === undefined ? null : new Set(documentIds);
  const candidates = indexed.filter(p => !scope || scope.has(p.documentId)).map(p => {
    const matched = terms.filter(t => p.bodyTerms.includes(t) || p.headingTerms.includes(t) || p.titleTerms.includes(t));
    const distinctive = matched.filter(t => anchors.has(t));
    const coverage = matched.length / terms.length;
    const weight = matched.reduce((sum, t) => sum + Math.log(1 + indexed.length / (docFrequency.get(t) || 1)) * (p.headingTerms.includes(t) ? 2 : 1), 0);
    return { p, matched, coverage, distinctive, score: weight * (0.5 + coverage) };
  }).filter(({matched,coverage,distinctive}) =>
    coverage >= 0.3 && (matched.length >= 2 || (terms.length === 1 && distinctive.length > 0)) && distinctive.length > 0
  ).sort((a,b) => b.score - a.score || a.p.id.localeCompare(b.p.id));
  if (!candidates.length) return empty;
  const results = candidates.filter(c => c.score >= candidates[0].score * 0.35).slice(0,4).map(({p,score}) => ({
    id:p.id, documentId:p.documentId, documentTitle:p.documentTitle, heading:p.heading, text:p.text, url:p.url, score:Number(score.toFixed(3)),
  }));
  return { status:'found', results, terms };
}
