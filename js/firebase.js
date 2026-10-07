// Inicializa Firebase Realtime Database (solo lectura desde este portal).
// Las librerías "compat" se cargan por <script> en index.html antes que este módulo.

import { firebaseConfig } from './config.js';

/** @returns {firebase.database.Database | null} null si la librería no cargó (sin conexión). */
export function iniciarFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase no está disponible; el portal funciona sin datos en vivo.');
    return null;
  }
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  return firebase.database();
}
