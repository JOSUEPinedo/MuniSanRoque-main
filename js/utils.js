// Utilidades pequeñas y sin dependencias.

export const $ = (selector, raiz = document) => raiz.querySelector(selector);
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

/** Escapa texto para insertarlo dentro de HTML. Úsalo con todo dato que venga de fuera. */
export function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/** Minúsculas y sin tildes, para búsquedas tolerantes ("licencia" encuentra "Licéncia"). */
export const normalizar = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Convierte requisitos con <br> y <b> en texto plano para compartir. */
export const htmlATexto = (html) =>
  String(html ?? '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();

export const urlWhatsApp = (telefono, texto) =>
  `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
