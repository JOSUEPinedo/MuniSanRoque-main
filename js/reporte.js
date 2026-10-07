// Formulario de reporte ciudadano: arma un mensaje y abre WhatsApp. Solo en horario de atención.

import { MUNI } from './config.js';
import { estadoAtencion, textoHorario } from './horario.js';
import { $, urlWhatsApp } from './utils.js';

const BASE = 'w-full p-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 transition-all text-white';

export function actualizarReporte(estado) {
  const boton = $('#btn-reporte-final');
  const indicador = $('#indicador-horario');
  if (estado.abierto) {
    boton.disabled = false;
    boton.className = `${BASE} bg-green-700 active:scale-95`;
    boton.innerHTML = '<i class="fa-brands fa-whatsapp text-2xl" aria-hidden="true"></i> Enviar a WhatsApp';
    indicador.innerHTML = '<span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-[12px] font-black uppercase italic tracking-widest">● Oficina atendiendo</span>';
  } else {
    boton.disabled = true;
    boton.className = `${BASE} bg-red-700 opacity-70 cursor-not-allowed`;
    const motivo = estado.motivo === 'fin_de_semana' ? 'Cerrado (atención Lun-Vie)' : 'Fuera de horario';
    boton.innerHTML = `<i class="fa-solid fa-clock text-2xl" aria-hidden="true"></i> ${motivo}`;
    indicador.innerHTML = '<span class="bg-red-100 text-red-800 px-4 py-2 rounded-full text-[12px] font-black uppercase italic tracking-widest">● Mesa de partes cerrada</span>';
  }
}

export function iniciarReporte() {
  $('#horario-reporte').textContent = `Atención: Lun a Vie | ${textoHorario()}`;
  $('#form-reporte').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!estadoAtencion().abierto) {
      alert(`El horario de atención ha terminado. Por favor, intente en horario de atención (${textoHorario()}).`);
      return;
    }
    const nombre = $('#repo_nombre').value.trim();
    const detalle = $('#repo_detalle').value.trim();
    if (!nombre || !detalle) return;
    const texto = `🚨 *REPORTE CIUDADANO* 🚨\n\n👤 *Nombre:* ${nombre}\n📝 *Detalle:* ${detalle}`;
    // encodeURIComponent protege caracteres como & # o saltos de línea escritos por el vecino.
    window.open(urlWhatsApp(MUNI.telefonoReportes, texto), '_blank', 'noopener');
  });
}
