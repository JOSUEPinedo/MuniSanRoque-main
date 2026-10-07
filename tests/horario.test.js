import test from 'node:test';
import assert from 'node:assert/strict';
import { estadoAtencion, textoHorario, formatoAmPm } from '../js/horario.js';

// Lima es UTC-5 todo el año (sin horario de verano).
const lima = (iso) => new Date(`${iso}-05:00`);

test('abierto un lunes a media mañana', () => {
  assert.deepEqual(estadoAtencion(lima('2026-10-05T10:00:00')), { abierto: true, motivo: null });
});

test('abre exactamente a las 07:30 y no antes', () => {
  assert.equal(estadoAtencion(lima('2026-10-05T07:29:00')).motivo, 'antes');
  assert.equal(estadoAtencion(lima('2026-10-05T07:30:00')).abierto, true);
});

test('cierra exactamente a las 15:30', () => {
  assert.equal(estadoAtencion(lima('2026-10-05T15:29:00')).abierto, true);
  assert.equal(estadoAtencion(lima('2026-10-05T15:30:00')).motivo, 'despues');
});

test('cerrado sábado y domingo', () => {
  assert.equal(estadoAtencion(lima('2026-10-10T10:00:00')).motivo, 'fin_de_semana');
  assert.equal(estadoAtencion(lima('2026-10-11T10:00:00')).motivo, 'fin_de_semana');
});

test('usa la hora de Lima aunque el dispositivo esté en otra zona', () => {
  // 2026-10-05 20:00 UTC = 15:00 en Lima (abierto) pero 05:00 del martes en Tokio.
  assert.equal(estadoAtencion(new Date('2026-10-05T20:00:00Z')).abierto, true);
  // 2026-10-05 21:00 UTC = 16:00 en Lima (cerrado).
  assert.equal(estadoAtencion(new Date('2026-10-05T21:00:00Z')).motivo, 'despues');
});

test('formatos de hora', () => {
  assert.equal(formatoAmPm('07:30'), '7:30 AM');
  assert.equal(formatoAmPm('15:30'), '3:30 PM');
  assert.equal(textoHorario(), '7:30 AM - 3:30 PM');
});
