// Actividades del mes, en tiempo real desde Firebase (nodo "agenda"). Un solo listener.

import { $, esc } from './utils.js';
import { abrirModal } from './modal.js';

let eventos = [];

const vacio = (mensaje) => `
  <div class="col-span-full p-10 text-center">
    <i class="fa-solid fa-calendar-day text-4xl mb-2 text-slate-400" aria-hidden="true"></i>
    <p class="text-xs font-black uppercase italic tracking-widest text-slate-500">${esc(mensaje)}</p>
  </div>`;

function tarjeta(ev, i) {
  // Si el evento trae descripción, la tarjeta es un botón que abre el detalle.
  const interactivo = Boolean(ev.descripcion);
  const abre = interactivo
    ? `<button type="button" data-evento="${i}" class="w-full text-left"`
    : '<div';
  const cierra = interactivo ? '</button>' : '</div>';
  return `
    <article class="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
      ${abre}>
        <div class="flex items-center gap-5">
          <div class="bg-green-700 text-white p-4 rounded-3xl text-center min-w-[70px] shadow-lg shadow-green-200">
            <span class="block text-2xl font-black leading-none">${esc(ev.dia)}</span>
            <span class="text-[11px] font-black uppercase tracking-widest">${esc(ev.mes)}</span>
          </div>
          <div class="text-left flex-1">
            <h4 class="text-slate-900 font-black text-sm uppercase leading-tight mb-2">${esc(ev.titulo)}</h4>
            <p class="flex items-center gap-2 text-slate-600 text-[12px] font-bold">
              <i class="fa-solid fa-clock text-green-700 text-[11px]" aria-hidden="true"></i>${esc(ev.hora || 'Por confirmar')}
            </p>
            <p class="flex items-center gap-2 text-slate-500 text-[12px] font-medium italic">
              <i class="fa-solid fa-location-dot text-slate-400 text-[11px]" aria-hidden="true"></i>${esc(ev.lugar || 'San Roque de Cumbaza')}
            </p>
          </div>
        </div>
      ${cierra}
    </article>`;
}

export function iniciarAgenda(db) {
  const contenedor = $('#listaAgenda');
  if (!db) {
    contenedor.innerHTML = vacio('No se pudo cargar la agenda. Revise su conexión.');
    return;
  }

  contenedor.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-evento]');
    if (!boton) return;
    const ev = eventos[Number(boton.dataset.evento)];
    const cuerpo = document.createElement('div');
    cuerpo.className = 'space-y-3';
    const linea = (etiqueta, valor) => {
      const p = document.createElement('p');
      const b = document.createElement('b');
      b.textContent = `${etiqueta}: `;
      p.append(b, valor);
      return p;
    };
    const detalle = document.createElement('div');
    detalle.className = 'bg-slate-50 p-4 rounded-2xl mt-4 border-l-4 border-institucional';
    detalle.textContent = ev.descripcion;
    cuerpo.append(linea('Hora', ev.hora || 'Por confirmar'), linea('Lugar', ev.lugar || 'San Roque de Cumbaza'), detalle);
    abrirModal(ev.titulo, cuerpo);
  });

  db.ref('agenda').on('value', (snap) => {
    eventos = [];
    snap.forEach((hijo) => { eventos.push(hijo.val()); });
    contenedor.innerHTML = eventos.length
      ? eventos.map(tarjeta).join('')
      : vacio('Sin actividades programadas');
  }, (error) => {
    console.error('Firebase agenda', error);
    contenedor.innerHTML = vacio('No se pudo cargar la agenda.');
  });
}
