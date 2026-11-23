import { tourStatus, placeStatus, japanTime } from '../src/hours';
import { TOURS } from '../src/data/tours';
const T = (id) => TOURS.find((t) => t.id === id);
const at = (iso) => new Date(iso);

test('hora de Japón aunque el teléfono esté en otra zona', () => {
  const jt = japanTime(at('2026-11-16T00:30:00Z')); // 9:30 en Japón, domingo 23:30 en Chile... da igual
  expect(jt.key).toBe('2026-11-16');
  expect(jt.wd).toBe(1);
  expect(jt.min).toBe(9 * 60 + 30);
});

test('castillo de Edo: lunes y viernes cerrado, con fecha recomendada', () => {
  const lun = tourStatus(T('edo'), at('2026-11-16T10:00:00+09:00'));
  expect(lun.blocking).toBe(true);
  expect(lun.chip.text).toBe('Hoy cerrado (lunes)');
  expect(lun.message).toMatch(/Jardines del Este están cerrados \(lunes\)\. Te recomiendo ir mañana/);
  expect(tourStatus(T('edo'), at('2026-11-20T10:00:00+09:00')).chip.text).toBe('Hoy cerrado (viernes)');
});

test('lunes feriado abre y cierra el martes', () => {
  expect(tourStatus(T('edo'), at('2026-11-23T10:00:00+09:00')).blocking).toBe(false);
  const mar = tourStatus(T('edo'), at('2026-11-24T10:00:00+09:00'));
  expect(mar.blocking).toBe(true);
  expect(mar.message).toMatch(/porque el lunes fue feriado/);
  expect(placeStatus('seishomon', at('2026-11-24T10:00:00+09:00')).state).toBe('closed');
});

test('llegada tarde y ya cerrado', () => {
  const tarde = tourStatus(T('edo'), at('2026-11-17T15:10:00+09:00'));
  expect(tarde.message).toMatch(/reciben gente hasta las 15:30 y a pie llegarías/);
  expect(tourStatus(T('meiji'), at('2026-11-17T17:00:00+09:00')).chip.text).toBe('Ya cerró por hoy');
});

test('Asakusa de noche: el salón cierra pero el recinto sigue abierto', () => {
  const s = tourStatus(T('asakusa'), at('2026-11-17T20:00:00+09:00'));
  expect(s.blocking).toBe(false);
  expect(s.chip.text).toBe('Salón cerrado · exterior abierto');
});

test('recorridos sin horarios no muestran estado', () => {
  expect(tourStatus({ id: 'x', stops: [{ id: 'tatsumi' }, { id: 'okuni' }] })).toBe(null);
});
