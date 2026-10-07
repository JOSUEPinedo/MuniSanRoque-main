// Comunicado oficial urgente (nodo "aviso_urgente" en Firebase). Si está vacío, se oculta.

import { $ } from './utils.js';

export function iniciarAvisos(db) {
  if (!db) return;
  const contenedor = $('#contenedor-aviso-urgente');
  const texto = $('#texto-aviso-vecino');
  db.ref('aviso_urgente').on('value', (snap) => {
    const data = snap.val();
    const mensaje = data && typeof data.mensaje === 'string' ? data.mensaje.trim() : '';
    texto.textContent = mensaje;
    contenedor.classList.toggle('hidden', !mensaje);
  }, (error) => console.error('Firebase aviso_urgente', error));
}
