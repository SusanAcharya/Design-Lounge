// node --test scripts/gates/ratchet-guard.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raiseReason, isPlaceholder, raises } from './ratchet-guard.mjs';

const tag = (reason) => `Fix a pricing card.\n\n[raise-ceiling: ${reason}]\n`;

test('a real reason is returned, trimmed', () => {
  assert.equal(raiseReason(tag('  Linux fonts render the ledger table wider  ')), 'Linux fonts render the ledger table wider');
});

test('placeholders are rejected', () => {
  assert.equal(raiseReason(tag('<reason>')), null);
  assert.equal(raiseReason(tag('<why the ceiling goes up>')), null);
  assert.equal(raiseReason(tag('< anything at all in brackets >')), null);
  assert.equal(raiseReason(tag('too short')), null); // 9 characters
  assert.equal(raiseReason(tag('')), null);
  assert.equal(raiseReason(tag('   ')), null);
});

test('exactly 10 characters is enough', () => {
  assert.equal(raiseReason(tag('0123456789')), '0123456789');
  assert.equal(isPlaceholder('012345678'), true);
});

test('no tag, no reason', () => {
  assert.equal(raiseReason('Fix a pricing card.'), null);
  assert.equal(raiseReason(''), null);
});

test('a placeholder tag does not hide a real one later in the range', () => {
  const log = tag('<reason>') + '\n' + tag('the y2k demo moved to a new font');
  assert.equal(raiseReason(log), 'the y2k demo moved to a new font');
});

test('raises() still reports what went up', () => {
  const prev = { ceiling: { phone390: 1, contrast: 1, uiLines: 0 }, phone390: ['a'], contrast: ['b'], uiLines: [] };
  const next = { ceiling: { phone390: 1, contrast: 2, uiLines: 0 }, phone390: ['a'], contrast: ['b', 'c'], uiLines: [] };
  assert.deepEqual(raises(prev, next), ['contrast: ceiling 1 → 2', 'contrast: list 1 → 2', 'contrast: new ids c']);
  assert.deepEqual(raises(next, prev), []);
});
