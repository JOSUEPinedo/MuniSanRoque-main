// Aplica el estado "abierto/cerrado" a toda la interfaz. Se ejecuta al inicio y cada minuto.

import { MUNI } from './config.js';
import { estadoAtencion, fechaLima, horaLima, textoHorario } from './horario.js';
import { actualizarOficinas } from './oficinas.js';
import { actualizarReporte } from './reporte.js';
import { $ } from './utils.js';

export function actualizarEstadoGlobal() {
  const estado = estadoAtencion();

  $('#msg-bienvenida').textContent = estado.abierto
    ? '¡Buen día, vecino! Estamos listos para atenderle.'
    : `Gracias por visitarnos. El horario de atención es Lunes - Viernes de ${textoHorario()}.`;

  // El pago virtual solo se ofrece cuando hay alguien que pueda coordinarlo.
  $('#bannerPagoVirtual').classList.toggle('hidden', !estado.abierto);

  actualizarOficinas(estado);
  actualizarReporte(estado);
}

export function iniciarReloj() {
  $('#horario-texto').textContent = textoHorario();
  $('#enlacePagoVirtual').href =
    `https://wa.me/${MUNI.telefonoReportes}?text=${encodeURIComponent(MUNI.mensajePagoVirtual)}`;
  const pintar = () => {
    const ahora = new Date();
    $('#txt-fecha').textContent = fechaLima(ahora);
    $('#txt-hora').textContent = horaLima(ahora);
  };
  pintar();
  setInterval(pintar, 1000);
}
