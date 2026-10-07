// Directorio de oficinas: contacto por WhatsApp + estado en vivo (Firebase) + horario.

import { OFICINAS } from './config.js';
import { MENSAJE_CIERRE } from './horario.js';
import { $, esc, urlWhatsApp } from './utils.js';

const remoto = {}; // oficinas/<id> -> { estado: "SI"|"NO", motivo }
let ultimoEstado = { abierto: false, motivo: 'antes' };

const tarjeta = (sub) => `
  <div id="card-${sub.id}" class="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between gap-3 mb-3 transition-all duration-500">
    <div class="flex items-center gap-4 text-left min-w-0">
      <div id="icon-bg-${sub.id}" class="h-10 w-10 shrink-0 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500" aria-hidden="true">
        <i id="icon-i-${sub.id}" class="fa-solid fa-door-closed"></i>
      </div>
      <div class="min-w-0">
        <h4 class="text-sm font-black uppercase italic text-slate-800 leading-tight">${esc(sub.n)}</h4>
        <div class="flex items-center gap-2 mt-1">
          <span id="dot-${sub.id}" class="h-2 w-2 shrink-0 rounded-full bg-slate-300" aria-hidden="true"></span>
          <span id="txt-${sub.id}" class="text-[11px] font-black uppercase italic text-slate-500"></span>
        </div>
      </div>
    </div>
    <a id="wa-${sub.id}" href="${urlWhatsApp(sub.tel, sub.msg)}" target="_blank" rel="noopener noreferrer"
       aria-label="Escribir por WhatsApp a ${esc(sub.n)}"
       class="h-11 w-11 shrink-0 bg-green-100 text-green-800 rounded-full flex items-center justify-center active:scale-90 transition">
      <i class="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
    </a>
  </div>`;

function aplicar(sub) {
  const g = (p) => document.getElementById(`${p}-${sub.id}`);
  const [card, dot, txt, iconBg, icon, wa] = ['card', 'dot', 'txt', 'icon-bg', 'icon-i', 'wa'].map(g);

  let tono; // 'cerrado' | 'abierto' | 'ocupado' | 'neutro'
  let texto;
  if (!ultimoEstado.abierto) {
    tono = 'cerrado';
    texto = MENSAJE_CIERRE[ultimoEstado.motivo];
  } else if (!remoto[sub.id]) {
    tono = 'neutro';
    texto = 'En horario de atención';
  } else if (remoto[sub.id].estado === 'SI') {
    tono = 'abierto';
    texto = 'Atendiendo ahora';
  } else {
    tono = 'ocupado';
    texto = remoto[sub.id].motivo || 'En descanso';
  }

  const estilos = {
    cerrado: { punto: 'bg-orange-400', texto: 'text-orange-700', borde: '#f97316', icono: 'fa-door-closed', fondoIcono: 'bg-slate-100 text-slate-500' },
    abierto: { punto: 'bg-green-500 animate-pulse', texto: 'text-green-700', borde: '#22c55e', icono: 'fa-door-open', fondoIcono: 'bg-green-100 text-green-700' },
    ocupado: { punto: 'bg-red-500', texto: 'text-red-700', borde: '#ef4444', icono: 'fa-door-closed', fondoIcono: 'bg-red-100 text-red-600' },
    neutro: { punto: 'bg-slate-300', texto: 'text-slate-500', borde: '#cbd5e1', icono: 'fa-door-open', fondoIcono: 'bg-slate-100 text-slate-500' },
  }[tono];

  txt.textContent = texto; // textContent: el motivo viene de Firebase
  txt.className = `text-[11px] font-black uppercase italic ${estilos.texto}`;
  dot.className = `h-2 w-2 shrink-0 rounded-full ${estilos.punto}`;
  card.style.borderLeft = `6px solid ${estilos.borde}`;
  iconBg.className = `h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${estilos.fondoIcono}`;
  icon.className = `fa-solid ${estilos.icono}`;

  const deshabilitado = tono === 'cerrado';
  wa.classList.toggle('pointer-events-none', deshabilitado);
  wa.classList.toggle('opacity-30', deshabilitado);
  wa.classList.toggle('grayscale', deshabilitado);
  wa.setAttribute('aria-disabled', String(deshabilitado));
  wa.tabIndex = deshabilitado ? -1 : 0;
}

const todas = () => OFICINAS.flatMap((cat) => cat.subs);

/** Se llama al inicio y cada minuto: reaplica horario + último estado remoto conocido. */
export function actualizarOficinas(estado) {
  ultimoEstado = estado;
  todas().forEach(aplicar);
}

export function iniciarOficinas(db) {
  $('#listaOficinas').innerHTML = OFICINAS.map((cat) => `
    <section aria-labelledby="cat-${esc(cat.subs[0].id)}">
      <h3 id="cat-${esc(cat.subs[0].id)}" class="text-[12px] font-black uppercase text-slate-500 mb-3 mt-6 ml-4 tracking-widest italic">${esc(cat.nombre)}</h3>
      ${cat.subs.map(tarjeta).join('')}
    </section>`).join('');
  todas().forEach(aplicar);

  if (!db) return;
  todas().forEach((sub) => {
    db.ref(`oficinas/${sub.id}`).on('value', (snap) => {
      remoto[sub.id] = snap.val();
      aplicar(sub);
    }, (error) => console.error(`Firebase oficinas/${sub.id}`, error));
  });
}
