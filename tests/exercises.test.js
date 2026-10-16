// Ejecutar desde la raíz del repo: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const L = require('../exercises.js');

const fixture = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-workouts.json'), 'utf8'));
const ex = (store, date, name) => store['workout-' + date].exercises.find(e => (e.originalName || e.name) === name);

test('catálogo: ids únicos y campos obligatorios', () => {
  const ids = new Set();
  for (const e of L.CATALOG) {
    assert.ok(!ids.has(e.id), 'id duplicado: ' + e.id); ids.add(e.id);
    assert.ok(L.PATTERNS[e.pattern], `${e.id}: patrón desconocido ${e.pattern}`);
    assert.ok(L.EQUIPMENT[e.equipment], `${e.id}: equipo desconocido ${e.equipment}`);
    assert.ok(e.muscle, `${e.id}: falta músculo`);
  }
});

test('alias: todos apuntan a ids del catálogo', () => {
  const ids = new Set(L.CATALOG.map(e => e.id));
  for (const a of L.ALIASES) assert.ok(ids.has(a.id), 'alias a id inexistente: ' + a.id);
});

test('la rutina de la app solo usa ids del catálogo', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const used = [...html.matchAll(/exerciseId: '([a-z0-9-]+)'/g)].map(m => m[1]);
  assert.ok(used.length >= 30, 'no se encontraron exerciseId en PROGRAM');
  const ids = new Set(L.CATALOG.map(e => e.id));
  for (const id of used) assert.ok(ids.has(id), 'PROGRAM usa un id que no está en el catálogo: ' + id);
});

test('index.html y tracker.html son idénticos', () => {
  const a = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const b = fs.readFileSync(path.join(__dirname, '..', 'tracker.html'), 'utf8');
  assert.equal(a, b);
});

test('resolución: casos que antes se fusionaban mal ahora se separan', () => {
  const r = (name, trackId, date) => L.resolveExerciseId({ name, trackId }, date);
  assert.equal(r('Isquios sentado en máquina', 'isquios', '2026-09-17'), 'isquios-sentado');
  assert.equal(r('Isquios tumbado en máquina', null, '2026-05-21'), 'isquios-tumbado');
  assert.equal(r('Elev. laterales pesas de pie', null, '2026-05-19'), 'lateral-mancuerna-pie');
  assert.equal(r('Elev. laterales sentado mancuernas', 'lateral-mancuerna', '2026-09-04'), 'lateral-mancuerna-sentado');
  assert.equal(r('Curl polea baja', 'curl-polea', '2026-09-20'), 'curl-polea');
  assert.equal(r('Curl polea baja', 'curl-polea', '2026-09-21'), 'curl-polea-keiser');
  assert.equal(r('Jalón cerrado en polea', 'jalon', '2026-05-27'), 'jalon-cerrado');
  assert.equal(r('Jalón al pecho', 'jalon', '2026-09-21'), 'jalon-pecho');
  assert.equal(r('Press vertical en máquina', 'press-maquina', '2026-10-11'), 'press-vertical-maquina');
  assert.equal(r('Remo sentado máquina codos altos', 'remo-alto', '2026-05-27'), 'remo-alto-r9');
  assert.equal(r('Remo sentado máquina codos altos', 'remo-alto', '2026-06-23'), 'remo-alto');
});

test('resolución: el mismo ejercicio con nombres distintos se une', () => {
  const r = (name, date) => L.resolveExerciseId({ name }, date);
  assert.equal(r('Lumbares en banco', '2026-04-07'), r('Extensiones en banco romano', '2026-05-27'));
  assert.equal(r('Extensiones de rodillas', '2026-04-03'), r('Cuádriceps en máquina', '2026-09-17'));
  assert.equal(r('Press inclinado barra', '2026-04-27'), r('Press inclinado barra guiada', '2026-09-04'));
  assert.equal(r('Encogimientos con mancuernas', '2026-04-07'), r('Encogimientos con pesas', '2026-09-21'));
});

test('resolución: insensible a tildes y mayúsculas; un id guardado por la app manda', () => {
  assert.equal(L.resolveExerciseId({ name: 'JALON AL PECHO' }, '2026-10-01'), 'jalon-pecho');
  assert.equal(L.resolveExerciseId({ name: 'Jalón al pecho', exerciseId: 'otro-id', mappedBy: 'app' }, '2026-10-01'), 'otro-id');
});

test('carga total: barra guiada +15, peso corporal + lastre, sin carga = 0; dato bruto intacto', () => {
  const guiada = L.getExercise('press-inclinado-guiada');
  const set = { weight: '26', reps: '8' };
  assert.equal(L.totalLoad(set.weight, guiada), 41);
  assert.equal(set.weight, '26');
  assert.equal(L.totalLoad('0', guiada), 0, 'sin peso no se inventa carga');
  assert.equal(L.totalLoad('5', L.getExercise('dominadas-cerradas'), 72.7), 77.7);
  assert.equal(L.totalLoad('0', L.getExercise('dominadas-cerradas'), 72.7), 72.7);
  assert.equal(L.totalLoad('0', L.getExercise('dominadas-cerradas'), null), 0, 'sin peso corporal no hay carga');
  assert.equal(L.totalLoad('35', L.getExercise('ab-wheel')), 0);
  assert.equal(L.totalLoad('76', L.getExercise('remo-bajo-maquina')), 76);
});

test('e1RM Epley y mejor serie', () => {
  assert.equal(L.epley(100, 10), 133.3);
  assert.equal(L.epley(100, 1), 100);
  assert.equal(L.epley(100, 20), null, 'por encima de 15 reps no se estima');
  const { best } = L.bestSet([{ weight: '26', reps: '8' }, { weight: '22', reps: '8' }], L.getExercise('press-inclinado-guiada'));
  assert.deepEqual(best, { e1rm: 51.9, load: 41, reps: 8, raw: 26 }); // 41 × (1 + 8/30)
});

test('cambio de máquina: la cadena de variantes se sigue y no hace bucles', () => {
  assert.equal(L.followSwaps('a', { a: { to: 'b' }, b: { to: 'c' } }), 'c');
  assert.equal(L.followSwaps('a', { a: { to: 'b' }, b: { to: 'a' } }), 'a');
  const cat = L.getCatalog([{ id: 'remo-bajo-maquina--x', name: 'Remo bajo (X)', pattern: 'traccion-horizontal', muscle: 'Espalda', equipment: 'maquina', variantOf: 'remo-bajo-maquina' }]);
  assert.ok(cat.find(e => e.id === 'remo-bajo-maquina--x'));
});

test('migración: 0 sin asignar, totales idénticos, nombres originales conservados', () => {
  const before = fixture();
  const { store: after, unmapped, changes } = L.migrate(before);
  assert.deepEqual(unmapped, []);
  assert.ok(changes.length > 50);
  const v = L.validateMigration(before, after);
  for (const c of v.checks) assert.ok(c.ok, `${c.label}: ${c.detail}`);
  assert.equal(ex(after, '2026-05-21', 'Isquios tumbado en máquina').exerciseId, 'isquios-tumbado');
  assert.equal(ex(after, '2026-05-21', 'Isquios tumbado en máquina').originalName, 'Isquios tumbado en máquina');
  assert.equal(ex(after, '2026-09-21', 'Curl polea baja').exerciseId, 'curl-polea-keiser');
  assert.equal(before['workout-2026-05-21'].exercises[0].exerciseId, undefined, 'la entrada no se muta');
  assert.equal(after['weight-2026-10-11'], 72.7, 'claves que no son entrenos intactas');
});

test('migración idempotente: dos pasadas = una pasada', () => {
  const once = L.migrate(fixture()).store;
  const twice = L.migrate(once);
  assert.deepEqual(twice.store, once);
  assert.equal(twice.changes.length, 0);
});

test('migración: corregir un alias se propaga, pero no toca lo guardado por la app', () => {
  const once = L.migrate(fixture()).store;
  once['workout-2026-10-11'].exercises.push({ name: 'Nuevo', exerciseId: 'remo-alto', mappedBy: 'app', sets: [] });
  const aliases = L.ALIASES.map(a => a.id === 'curl-femoral-r8' ? Object.assign({}, a, { id: 'isquios-sentado' }) : a);
  const { store, changes } = L.migrate(once, { aliases });
  assert.equal(ex(store, '2026-04-03', 'Curl femoral sentado/tumbado').exerciseId, 'isquios-sentado');
  assert.equal(changes.length, 1);
  assert.equal(store['workout-2026-10-11'].exercises.at(-1).exerciseId, 'remo-alto');
});

test('migración: lo que no se reconoce se reporta y no se inventa', () => {
  const s = fixture();
  s['workout-2026-10-12'] = { date: '2026-10-12', viaId: 1, exercises: [{ name: 'Ejercicio desconocido', sets: [{ weight: '10', reps: '10' }] }] };
  const { unmapped, store } = L.migrate(s);
  assert.equal(unmapped.length, 1);
  assert.equal(store['workout-2026-10-12'].exercises[0].exerciseId, undefined);
  assert.equal(L.validateMigration(s, store).ok, false);
});

test('auditoría: una fila por nombre+trackId y saltos de carga ≥25 %', () => {
  const rows = L.audit(fixture());
  const remoAlto = rows.find(r => r.name === 'Remo sentado máquina codos altos');
  assert.equal(remoAlto.sessions, 2);
  assert.deepEqual(remoAlto.jumps, [{ date: '2026-06-23', from: 70, to: 45 }]);
  assert.equal(remoAlto.confidence, 'dudoso');
  const curl = rows.find(r => r.name === 'Curl polea baja');
  assert.deepEqual(curl.ids.sort(), ['curl-polea', 'curl-polea-keiser']);
  assert.ok(curl.jumps.length >= 1);
  const csv = L.auditToCsv(rows);
  assert.ok(csv.startsWith('nombre,trackId,id_asignado'));
  assert.equal(csv.split('\n').length, rows.length + 1);
});
