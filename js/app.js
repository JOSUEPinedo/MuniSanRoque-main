// Punto de entrada: conecta los módulos y registra el service worker.

import { iniciarFirebase } from './firebase.js';
import { iniciarModal } from './modal.js';
import { iniciarTabs } from './tabs.js';
import { iniciarTramites } from './tramites.js';
import { iniciarOficinas } from './oficinas.js';
import { iniciarAgenda } from './agenda.js';
import { iniciarAvisos } from './avisos.js';
import { iniciarReporte } from './reporte.js';
import { actualizarEstadoGlobal, iniciarReloj } from './estado.js';

function ocultarCarga() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  loader.classList.add('fade-out');
  setTimeout(() => loader.remove(), 500);
}

async function iniciar() {
  try {
    const db = iniciarFirebase();
    iniciarModal();
    iniciarTabs();
    iniciarReloj();
    iniciarReporte();
    iniciarOficinas(db);
    iniciarAgenda(db);
    iniciarAvisos(db);
    actualizarEstadoGlobal();
    setInterval(actualizarEstadoGlobal, 60_000);
    await iniciarTramites();
  } catch (error) {
    console.error('Error al iniciar el portal', error);
  } finally {
    ocultarCarga();
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((e) => console.error('Service worker', e));
  });
}

iniciar();
