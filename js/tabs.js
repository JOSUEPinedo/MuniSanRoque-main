// Pestañas con roles ARIA, navegación con flechas y enlace directo (#pagos, #oficinas...).

import { $, $$ } from './utils.js';

const PESTANAS = ['inicio', 'pagos', 'oficinas', 'ayuda', 'consulta'];

export function cambiarPestana(nombre, { enfocar = false, actualizarHash = true } = {}) {
  if (!PESTANAS.includes(nombre)) nombre = 'inicio';
  PESTANAS.forEach((p) => {
    const activa = p === nombre;
    const boton = $(`#tab-${p}`);
    boton.classList.toggle('active', activa);
    boton.classList.toggle('text-slate-500', !activa);
    boton.setAttribute('aria-selected', String(activa));
    boton.tabIndex = activa ? 0 : -1;
    $(`#panel-${p}`).classList.toggle('active', activa);
  });
  if (enfocar) $(`#tab-${nombre}`).focus();
  if (actualizarHash) history.replaceState(null, '', nombre === 'inicio' ? location.pathname : `#${nombre}`);
}

export function iniciarTabs() {
  const lista = $('#tablist');
  lista.addEventListener('click', (e) => {
    const boton = e.target.closest('[role="tab"]');
    if (!boton) return;
    cambiarPestana(boton.dataset.tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  lista.addEventListener('keydown', (e) => {
    const botones = $$('[role="tab"]', lista);
    const i = botones.findIndex((b) => b === document.activeElement);
    if (i < 0) return;
    let destino = null;
    if (e.key === 'ArrowRight') destino = (i + 1) % botones.length;
    if (e.key === 'ArrowLeft') destino = (i - 1 + botones.length) % botones.length;
    if (e.key === 'Home') destino = 0;
    if (e.key === 'End') destino = botones.length - 1;
    if (destino === null) return;
    e.preventDefault();
    cambiarPestana(botones[destino].dataset.tab, { enfocar: true });
  });
  window.addEventListener('hashchange', () =>
    cambiarPestana(location.hash.slice(1), { actualizarHash: false }));
  cambiarPestana(location.hash.slice(1) || 'inicio', { actualizarHash: false });
}
