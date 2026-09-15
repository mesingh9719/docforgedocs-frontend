import test from 'node:test';
import assert from 'node:assert/strict';
import { getNestedValue, resolveVariables } from '../src/utils/variableResolver.js';

test('legacy aliases survive missing or null nested values', () => {
    for (const client of [undefined, null, {}]) {
        assert.equal(getNestedValue({ client, client_name: 'Legacy Client' }, 'client.name'), 'Legacy Client');
    }
    assert.equal(getNestedValue({ 'client.name': 'Flat', client_name: 'Alias' }, 'client.name'), 'Flat');
    assert.equal(getNestedValue({ client: { name: 'Nested' }, client_name: 'Alias' }, 'client.name'), 'Nested');
});

test('invalid number precision cannot crash rendering', () => {
    for (const precision of [-1, 101, 1000000, 'invalid']) {
        assert.equal(resolveVariables(`{{amount | number:${precision}}}`, { amount: 1234 }), '1,234');
    }
    assert.equal(resolveVariables('{{amount | number:2}}', { amount: 0 }), '0.00');
    assert.equal(resolveVariables("{{missing || 'Fallback'}}", {}), 'Fallback');
});
