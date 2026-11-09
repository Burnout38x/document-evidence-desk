import test from 'node:test';
import assert from 'node:assert/strict';
import { documents } from '../src/data/documents.js';
import { searchDocuments } from '../src/lib/retrieval.js';

test('relevant sources survive normalization and uppercase input', () => {
  assert.equal(searchDocuments('WHY DOES FETCH NOT REJECT A 404?').results[0].id, 'fetch-status');
  assert.equal(searchDocuments('What is the difference between no-cache and no-store?').results[0].id, 'cache-validation');
});
test('unknown and empty questions abstain instead of attaching arbitrary evidence', () => {
  for (const q of ['', '   ', null, 'What is the weather tomorrow?', 'How should a server diagnose diabetes?', 'Tell me the best restaurant', '<script>alert(1)</script>']) {
    assert.deepEqual(searchDocuments(q).results, []);
  }
});
test('filters constrain evidence, including empty and unknown scopes', () => {
  assert.equal(searchDocuments('Is POST safe to retry?', {documentIds:['http-idempotency']}).status, 'found');
  assert.equal(searchDocuments('Is POST safe to retry?', {documentIds:['vite-secrets']}).status, 'insufficient');
  assert.equal(searchDocuments('fetch 404', {documentIds:[]}).status, 'insufficient');
  assert.equal(searchDocuments('fetch 404', {documentIds:['missing']}).status, 'insufficient');
});
test('citations are bounded, deterministic, and trace to real corpus notes', () => {
  const q='fetch request response HTTP POST retry';
  assert.deepEqual(searchDocuments(q), searchDocuments(q));
  const result=searchDocuments(q);
  assert.ok(result.results.length <= 4);
  for (const item of result.results) {
    const doc=documents.find(d=>d.id===item.documentId);
    assert.equal(doc.passages.find(p=>p.id===item.id).text,item.text);
    assert.equal(item.url,doc.url);
  }
});
test('invalid scope and input types do not throw or widen scope', () => {
  assert.equal(searchDocuments({question:'fetch'}).status,'insufficient');
  assert.equal(searchDocuments('fetch',{documentIds:'fetch-errors'}).status,'insufficient');
});
