// Configuración central del portal. Todo lo que cambia con frecuencia vive aquí.

export const MUNI = {
  zonaHoraria: 'America/Lima',
  abre: '07:30',
  cierra: '15:30',
  diasLaborales: [1, 2, 3, 4, 5], // 0 = domingo ... 6 = sábado
  // Número que recibe los reportes ciudadanos y las consultas de pago virtual.
  telefonoReportes: '51969356686',
  mensajePagoVirtual:
    'Hola Brayan, me encuentro fuera de San Roque y deseo pagar mis tributos...',
};

// La apiKey de Firebase es pública por diseño; la seguridad real está en las
// reglas de la base de datos (ver database.rules.example.json).
export const firebaseConfig = {
  apiKey: 'AIzaSyDMR-7Gd45RVckl2XE80wKrqoXb2rncsIA',
  databaseURL: 'https://muni-san-roque-default-rtdb.firebaseio.com',
  projectId: 'muni-san-roque',
};

// `id` enlaza cada oficina con el nodo oficinas/<id> de Firebase (estado en vivo).
export const OFICINAS = [
  {
    nombre: 'Gerencia y Secretaría',
    subs: [
      { id: 'secretaria', n: 'Secretaría General', tel: '51956532742', msg: 'Hola, deseo realizar una consulta a Secretaría.' },
    ],
  },
  {
    nombre: 'Rentas y Mesa de Partes',
    subs: [
      { id: 'rentas', n: 'Oficina de Rentas', tel: '51969356686', msg: 'Hola, consulto sobre mis tributos/arbitrios.' },
    ],
  },
  {
    nombre: 'Desarrollo Social y Humano',
    subs: [
      { id: 'sisfoh', n: 'ULE - SISFOH', tel: '51978757404', msg: 'Hola, consulto sobre mi empadronamiento SISFOH.' },
      { id: 'pvl', n: 'Vaso de Leche (PVL)', tel: '51961518855', msg: 'Hola, Información sobre el Programa Vaso de Leche.' },
      { id: 'defensa', n: 'Defensa Civil', tel: '51969356686', msg: 'Hola, Consulta sobre Defensa Civil.' },
      { id: 'omaped', n: 'OMAPED y CIAM', tel: '51978757404', msg: 'Hola, Consulta sobre programas sociales OMAPED/CIAM.' },
    ],
  },
  {
    nombre: 'Planeamiento Urbano y Catastro',
    subs: [
      { id: 'infraestructura', n: 'Oficina de Infraestructura', tel: '51939350568', msg: 'Hola, solicito información sobre.' },
    ],
  },
  {
    nombre: 'Servicios a la Comunidad',
    subs: [
      { id: 'agua', n: 'Agua (ATM)', tel: '51949515908', msg: 'Reporte o consulta sobre servicio de agua.' },
    ],
  },
];
