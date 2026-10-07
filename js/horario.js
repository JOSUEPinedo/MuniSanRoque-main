// Única fuente de verdad del horario de atención.
// Siempre se calcula en la zona horaria de la municipalidad, no en la del dispositivo.

import { MUNI } from './config.js';

const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Día de la semana (0-6) y minutos desde medianoche en la zona horaria dada. */
export function ahoraEnZona(fecha = new Date(), zona = MUNI.zonaHoraria) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  return {
    dia: DIAS[valor('weekday')],
    minutos: Number(valor('hour')) * 60 + Number(valor('minute')),
  };
}

/**
 * @returns {{abierto: boolean, motivo: null|'fin_de_semana'|'antes'|'despues'}}
 * Abre a la hora exacta de apertura y cierra a la hora exacta de cierre.
 */
export function estadoAtencion(fecha = new Date(), cfg = MUNI) {
  const { dia, minutos } = ahoraEnZona(fecha, cfg.zonaHoraria);
  if (!cfg.diasLaborales.includes(dia)) return { abierto: false, motivo: 'fin_de_semana' };
  if (minutos < aMinutos(cfg.abre)) return { abierto: false, motivo: 'antes' };
  if (minutos >= aMinutos(cfg.cierra)) return { abierto: false, motivo: 'despues' };
  return { abierto: true, motivo: null };
}

export const MENSAJE_CIERRE = {
  fin_de_semana: '¡Descansando! Atendemos el lunes desde las 7:30 AM',
  antes: '¡Pronto! Hoy atendemos desde las 7:30 AM',
  despues: '¡Hasta mañana! Atendemos desde las 7:30 AM',
};

/** "07:30" -> "7:30 AM" */
export function formatoAmPm(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

export function textoHorario(cfg = MUNI) {
  return `${formatoAmPm(cfg.abre)} - ${formatoAmPm(cfg.cierra)}`;
}

export function horaLima(fecha = new Date(), zona = MUNI.zonaHoraria) {
  return fecha.toLocaleTimeString('es-PE', { timeZone: zona, hour12: false });
}

export function fechaLima(fecha = new Date(), zona = MUNI.zonaHoraria) {
  return fecha.toLocaleDateString('es-PE', {
    timeZone: zona,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
