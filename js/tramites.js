// Lista de trámites y tasas (TUPA / TUSNE) con búsqueda. Los datos viven en data/tramites.json.

import { $, esc, normalizar, htmlATexto } from './utils.js';
import { abrirModal } from './modal.js';

let tramites = [];

const tarjeta = (t, i) => `
  <article class="item-search p-5 rounded-[2.5rem] flex justify-between items-center gap-3 shadow-sm bg-white border border-slate-100 transition-all hover:shadow-md">
    <div class="flex items-center gap-4 text-left min-w-0">
      <div class="h-12 w-12 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-100" aria-hidden="true">
        <i class="fa-solid ${esc(t.icon || 'fa-file-invoice')} text-lg"></i>
      </div>
      <div class="min-w-0">
        <span class="px-2 py-0.5 rounded-full text-white text-[10px] font-black ${t.tipo === 'TUSNE' ? 'bg-amber-700' : 'bg-green-700'}">${esc(t.tipo || 'TUPA')}</span>
        <h3 class="font-black text-[13px] uppercase mt-1 text-slate-800 leading-tight">${esc(t.n)}</h3>
        <span class="text-green-700 font-black text-[14px]">${esc(t.p)}</span>
      </div>
    </div>
    <button type="button" data-tramite="${i}" aria-label="Ver detalles de ${esc(t.n)}"
            class="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-sm active:scale-90 transition-all">
      Detalles
    </button>
  </article>`;

function pintar(filtro = '') {
  const q = normalizar(filtro).trim();
  const visibles = tramites
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => !q || normalizar(`${t.n} ${t.tipo} ${t.p}`).includes(q));
  $('#listaTasas').innerHTML = visibles.length
    ? visibles.map(({ t, i }) => tarjeta(t, i)).join('')
    : '<p class="text-center py-10 text-slate-500 font-bold">No se encontraron trámites.</p>';
  $('#contadorTasas').textContent = `${visibles.length} de ${tramites.length} trámites`;
}

function abrirDetalle(t) {
  const cuerpo = document.createElement('div');
  // t.r es HTML estático escrito por la municipalidad en data/tramites.json (no viene de usuarios).
  cuerpo.innerHTML = `
    <p class="text-[11px] font-black uppercase text-slate-500 mb-2">${esc(t.p)}</p>
    <p class="text-[11px] font-black uppercase text-slate-500 mb-2">Requisitos:</p>
    <div class="bg-slate-50 p-4 rounded-2xl mb-4 text-left text-[13px] leading-relaxed not-italic text-slate-700">${t.r || 'Consulte los requisitos en ventanilla.'}</div>`;
  const compartir = document.createElement('button');
  compartir.type = 'button';
  compartir.className = 'w-full bg-[#1a8f4a] text-white py-4 rounded-2xl font-black uppercase text-[12px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition';
  compartir.innerHTML = '<i class="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i> Compartir requisitos';
  compartir.addEventListener('click', () => {
    const msj = `*MUNI SAN ROQUE DE CUMBAZA*\n\n📌 *Trámite:* ${t.n.toUpperCase()}\n\n📝 *Requisitos:*\n${htmlATexto(t.r)}\n\n⚠️ _Todo trámite es presencial._\n🌐 _Portal Digital_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msj)}`, '_blank', 'noopener');
  });
  cuerpo.append(compartir);
  abrirModal(t.n, cuerpo);
}

export async function iniciarTramites() {
  const lista = $('#listaTasas');
  try {
    const respuesta = await fetch('data/tramites.json');
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    tramites = await respuesta.json();
  } catch (error) {
    console.error('No se pudo cargar data/tramites.json', error);
    lista.innerHTML = '<p class="text-center py-10 text-red-700 font-bold">No se pudieron cargar los trámites. Revise su conexión e intente de nuevo.</p>';
    return;
  }
  pintar();
  $('#searchInput').addEventListener('input', (e) => pintar(e.target.value));
  lista.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-tramite]');
    if (boton) abrirDetalle(tramites[Number(boton.dataset.tramite)]);
  });
}
