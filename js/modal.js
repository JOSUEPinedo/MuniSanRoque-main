// Modal accesible: role="dialog", cierra con Escape o clic fuera, atrapa el foco y lo devuelve.

import { $ } from './utils.js';

let modal;
let ultimoFoco = null;

const FOCALIZABLES = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function iniciarModal() {
  modal = $('#modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-cerrar-modal]')) cerrarModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') return cerrarModal();
    if (e.key !== 'Tab') return;
    const items = [...modal.querySelectorAll(FOCALIZABLES)];
    if (!items.length) return;
    const primero = items[0];
    const ultimo = items[items.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/** @param {string} titulo  @param {Node} cuerpo nodo ya construido por quien llama */
export function abrirModal(titulo, cuerpo) {
  ultimoFoco = document.activeElement;
  $('#modal-titulo').textContent = titulo;
  const contenedor = $('#modal-cuerpo');
  contenedor.replaceChildren(cuerpo);
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overflow-hidden');
  $('#modal-cerrar').focus();
}

export function cerrarModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('overflow-hidden');
  if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
}
