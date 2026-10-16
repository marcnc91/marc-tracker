// Genera sample-workouts.json con sesiones reales copiadas del export del 15 oct 2026.
// Formato compacto: [nombre, trackId|null, [[peso, reps], ...], comentario?]
const fs = require('fs');
const path = require('path');
const S = (date, viaId, viaName, exercises) => ({
  date, viaId, viaName,
  exercises: exercises.map(([name, trackId, sets, comment]) => {
    const e = { name, target: '', sets: sets.map(([w, r]) => ({ weight: String(w ?? ''), reps: String(r ?? ''), done: true })), comment: comment || '' };
    if (trackId) e.trackId = trackId;
    return e;
  }),
  cardio: true,
});
const sessions = [
  S('2026-04-03', 3, 'VIA 3 Pierna', [
    ['Curl femoral sentado/tumbado', null, [[47, 10], [55, 10], [55, 10]]],
    ['Gemelos en prensa', null, [['', ''], ['', ''], ['', '']]],
    ['Prensa inclinada', null, [[160, 12], [160, 15]]],
    ['Sentadilla máquina/hack/guiada', null, [[55, 10], [55, 12]]],
    ['Extensiones de rodillas', null, [[60, 10], [65, 10]]],
    ['Máquina aductores', null, [[40, 10], [40, 10], [40, 10]]],
    ['Máquina abductores', null, [[50, 10], [55, 10], [60, 10]]],
  ]),
  S('2026-04-07', 1, 'VIA 1 Tracción', [
    ['Dominadas cerradas con lastre', null, [[1, 6], [1, 6], [1, 6]]],
    ['Jalón abierto', null, [[88, 8], [88, 8]]],
    ['Remo cerrado en máquina', null, [[38, 8], [38, 8], [38, 8]]],
    ['Remo abierto en máquina', null, [[70, 10], [70, 10]]],
    ['Encogimientos con mancuernas', null, [[28, 12], [28, 12]]],
    ['Curl en máquina', null, [[30, 8], [30, 6]]],
    ['Curl en polea baja', null, [[12, 10], [12, 9]], 'Con macuernas en banco sentado'],
    ['Lumbares en banco', null, [[51, 12], [51, 12]]],
  ]),
  S('2026-04-27', 2, 'VIA 2 Empuje', [
    ['Press inclinado barra', null, [[28, 6], [26, 6]]],
    ['Press plano en máquina', null, [[28, 8], [28, 8]]],
    ['Fondos con lastre', null, [[95, 8], [95, 8]]],
    ['Contractora', null, [[28, 10], [28, 10]]],
    ['Elevaciones laterales mancuernas', null, [[9, 12], [9, 12], [9, 12]]],
    ['Press francés polea', null, [[22, 10], [22, 10]]],
    ['Patada tríceps polea', null, [[5.5, 10], [5.5, 10]]],
    ['Crunch en máquina', null, [[38, 12], [38, 12], [38, 12]]],
  ]),
  S('2026-05-19', 2, 'VIA 2 Pecho', [
    ['Press inclinado barra guiada', null, [[28, 6], [28, 6]]],
    ['Press sentado en máquina', null, [[50, 6], [55, 8]]],
    ['Contractora', null, [[32, 10], [32, 10]]],
    ['Cruces de poleas hacia abajo', null, [[11.2, 12], [12.2, 10]]],
    ['Elev. laterales pesas de pie', null, [[10, 12], [12, 12], [12, 12]]],
    ['Tríceps en polea agarre prono', null, [[20, 10], [20, 10], [20, 10]]],
    ['Press francés en polea', null, [[15, 10], [12, 10]]],
    ['Crunch en polea de pie', null, [[36, 15], [36, 15], [36, 15]]],
  ]),
  S('2026-05-21', 3, 'VIA 3 Piernas', [
    ['Abductores en máquina', null, [[51, 15], [55, 15], [58, 15]]],
    ['Gemelos en prensa', null, [[140, 16], [150, 16], [150, 16]]],
    ['Isquios sentado en máquina', null, [[48, 12], [48, 12]]],
    ['Isquios tumbado en máquina', null, [[50, 10], [50, 10]]],
    ['Cuádriceps en máquina', null, [[56, 12], [60, 12]]],
    ['Sentadilla cinturón/máquina/hack', null, [[60, 10], [60, 10]]],
    ['Prensa inclinada', null, [[190, 15], [190, 15]]],
    ['Aductores en máquina', null, [[39, 15], [42, 15], [42, 15]]],
  ]),
  S('2026-05-23', 4, 'VIA 4 Full Body', [
    ['Dominadas con lastre', 'dominadas', [[0, 8], [0, 5], [0, 5]]],
    ['Remo bajo en máquina', 'remo-maquina', [[70, 10], [70, 10], [70, 10]]],
    ['Press sentado en máquina', 'press-maquina', [[26, 8], [24, 8], [24, 8]]],
    ['Fondos en máquina', 'fondos', [[80, 11], [95, 10], [90, 20]]],
    ['Elev. laterales en máquina', 'lateral-maquina', [[10, 12], [10, 12], [10, 12]]],
    ['Curl barra Z de pie', 'curl-barra', [['', ''], ['', ''], ['', '']]],
    ['Press francés barra Z', 'french-barra', [['', ''], ['', ''], ['', '']]],
    ['Ab wheel de rodillas', 'abs-wheel', [['', ''], ['', ''], ['', '']]],
  ]),
  S('2026-05-27', 1, 'VIA 1 Pull', [
    ['Extensiones en banco romano', 'lumbar', [[60, 15], [60, 15]]],
    ['Remo con mancuerna en banco', 'remo-1brazo', [[28, 12], [28, 12]]],
    ['Remo sentado máquina codos altos', 'remo-alto', [[70, 10], [70, 10]]],
    ['Jalón cerrado en polea', 'jalon', [[0, 7], [0, 5]]],
    ['Pájaros en máquina', 'rear-delt', [[12, 12], [12, 12]]],
    ['Encogimientos pesas', 'trapecio', [[30, 10], [30, 10]]],
    ['Curl polea baja', 'curl-polea', [[28, 8], [28, 8], [28, 8]]],
    ['Elevaciones de piernas', 'abs-piernas', [['', ''], ['', ''], ['', '']]],
  ]),
  S('2026-06-23', 1, 'VIA 1 Pull', [
    ['Extensiones en banco romano', 'lumbar', [[60, 15], [60, 15]]],
    ['Remo con mancuerna en banco', 'remo-1brazo', [[26, 12], [24, 15]]],
    ['Remo sentado máquina codos altos', 'remo-alto', [[45, 10], [45, 10]]],
    ['Pájaros en máquina', 'rear-delt', [[10, 12], [10, 12]]],
    ['Encogimientos pesas', 'trapecio', [[28, 10], [28, 10]]],
  ]),
  S('2026-09-04', 2, 'VIA 2 Push', [
    ['Press sentado en máquina', 'press-maquina', [[57, 6], [57, 8]]],
    ['Press inclinado barra guiada', 'press-inclinado', [[24, 8], [24, 8]]],
    ['Aperturas inclinadas con mancuernas', 'aperturas-inclinadas', [[12, 10], [14, 10]]],
    ['Flexiones sobre banco', 'flexiones-banco', [[0, 12], [0, 12]]],
    ['Elev. laterales sentado mancuernas', 'lateral-mancuerna', [[10, 12], [10, 10], [10, 10]]],
    ['Tríceps en polea agarre prono', 'triceps-pushdown', [[9, 15], [12, 4], [11, 8]], 'Keiser '],
    ['Patada tríceps polea', 'patada-triceps', [[5, 10], [5, 10]]],
    ['Crunch en polea de pie', 'abs-crunch', [[30, 15], [30, 15], ['', '']]],
  ]),
  S('2026-09-09', 2, 'VIA 2 Push', [
    ['Press sentado en máquina', 'press-maquina', [[50, 6], [33, 16]]],
    ['Press inclinado barra guiada', 'press-inclinado', [[26, 8], [22, 8]]],
    ['Tríceps en polea agarre prono', 'triceps-pushdown', [[15, 15], [19, 12], [21, 8]]],
  ]),
  S('2026-09-17', 3, 'VIA 3 Legs', [
    ['Hip thrust', 'hip-thrust', [[98, 6], [98, 6]]],
    ['Prensa inclinada', 'prensa', [[160, 8], [160, 8]]],
    ['Sentadilla con cinturón', 'sentadilla', [[65, 10], [65, 10]], 'Excéntrico! '],
    ['Cuádriceps en máquina', 'quad-extension', [[71, 12], [71, 12]]],
    ['Isquios sentado en máquina', 'isquios', [[53, 12], [53, 12], [53, 12]]],
    ['Gemelos en prensa horizontal', 'gemelos', [[155, 15], [155, 15], [155, 15]]],
    ['Máquina aductores', 'aductores', [[46, 15], [46, 15], [46, 15]]],
    ['Máquina abductores', 'abductores', [[61, 15], [61, 15], [61, 15]]],
  ]),
  S('2026-09-21', 1, 'VIA 1 Pull', [
    ['Dominadas cerradas', 'dominadas', [[0, 6], [0, 6], [0, 6]]],
    ['Jalón al pecho', 'jalon', [[92, 8], [92, 8]]],
    ['Remo polea baja cerrado', 'remo-polea-cerrado', [[42, 6], [42, 6]]],
    ['Remo polea baja abierto', 'remo-polea-abierto', [[47, 8], [47, 8]]],
    ['Encogimientos con pesas', 'trapecio', [[32, 10], [32, 10]]],
    ['Curl con barra Z', 'curl-barra', [[33, 8], [33, 8]]],
    ['Curl polea baja', 'curl-polea', [[10, 8], [8, 10]], 'Cambio de máquina A KEISER'],
    ['Elevaciones de piernas', 'abs-piernas', [[0, 15], [0, 15], [0, 15]]],
  ]),
  S('2026-10-06', 1, 'VIA 1 Pull', [
    ['Dominadas cerradas', 'dominadas', [[0, 6], [0, 6], [0, 6]]],
    ['Jalón al pecho', 'jalon', [[98, 7], [93, 8]]],
    ['Curl polea baja', 'curl-polea', [[10, 10], [10, 10]]],
  ]),
  S('2026-10-10', 5, 'VIA 5 Brazos', [
    ['Curl barra de pie (barra recta)', 'curl-recta', [[13.8, 6], [13.8, 6]]],
    ['Extensiones en polea agarre prono', 'triceps-pushdown', [[11, 8], [11, 8]]],
    ['Fondos para tríceps con propio peso', 'fondos-bw', [[0, 12], [0, 12]]],
  ]),
  S('2026-10-11', 4, 'VIA 4 Full Body', [
    ['Remo bajo en máquina', 'remo-maquina', [[76, 10], [76, 10], [76, 10]]],
    ['Remo alto en máquina', 'remo-alto', [[48, 12], [48, 12], [48, 12]]],
    ['Press plano con barra libre o guiada', 'press-plano', [[45, 12], [47.5, 10], [47.5, 10]]],
    ['Press vertical en máquina', 'press-vertical', [[52, 10], [52, 10], [52, 10]]],
    ['Elevaciones laterales en polea', 'lateral-polea', [[4.5, 12], [4.5, 12], [4.5, 12]]],
    ['Ab wheel de rodillas', 'abs-wheel', [[35, 15], [35, 15], [35, 15]]],
  ]),
];
const store = {};
sessions.forEach(s => { store['workout-' + s.date] = s; });
store['workout-2026-10-04'] = { date: '2026-10-04', rest: true, sessionId: 'rest' };
Object.assign(store, { 'weight-2026-05-20': 71.6, 'weight-2026-09-20': 71.6, 'weight-2026-10-05': 72.3, 'weight-2026-10-11': 72.7 });
fs.writeFileSync(path.join(__dirname, 'sample-workouts.json'), JSON.stringify(store, null, 1));
console.log('sesiones:', sessions.length);
