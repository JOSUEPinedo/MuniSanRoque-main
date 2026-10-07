import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tramites = JSON.parse(readFileSync(new URL('../data/tramites.json', import.meta.url), 'utf8'));

test('todos los trámites tienen los campos obligatorios', () => {
  tramites.forEach((t, i) => {
    assert.ok(t.n && t.p && t.tipo, `trámite #${i} (${t.n}) incompleto`);
    assert.ok(['TUPA', 'TUSNE'].includes(t.tipo), `tipo inválido en "${t.n}"`);
  });
});

test('los precios usan un formato uniforme', () => {
  const ok = /^(S\/\. \d|Desde S\/\. |GRATUITO$|Varía$|Monto Variable$|Ver detalle$|Derecho de )/;
  tramites.forEach((t) => assert.match(t.p, ok, `precio raro en "${t.n}": ${t.p}`));
});

test('no hay nombres de trámite repetidos', () => {
  const nombres = tramites.map((t) => t.n);
  assert.equal(new Set(nombres).size, nombres.length);
});
