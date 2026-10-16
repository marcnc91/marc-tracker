/* ─────────────────────────────────────────────────────────────
   Catálogo canónico de ejercicios + alias + migración.

   Reglas:
   - Cada ejercicio tiene un id estable que NUNCA se cambia ni se reutiliza.
   - Si cambia la máquina, el agarre o el ángulo y la carga deja de ser
     comparable → id nuevo (variante) con el mismo patrón. Nunca se fusiona.
   - Los datos brutos no se tocan: el peso se guarda tal cual se introduce y
     la carga total (peso + extraLoadKg, + peso corporal si toca) se calcula aparte.
   - Ante la duda, ids separados: la vista por patrón ya los muestra juntos,
     y fusionarlos después es cambiar una línea de ALIASES.

   Este fichero no depende del DOM: lo usa la app (window.ExerciseLib) y los
   tests de Node (require('./exercises.js')).
   ───────────────────────────────────────────────────────────── */
(function (root, factory) {
  const lib = factory();
  if (typeof module === 'object' && module.exports) module.exports = lib;
  else root.ExerciseLib = lib;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CATALOG_VERSION = 1;

  const PATTERNS = {
    'empuje-horizontal': 'Empuje horizontal',
    'empuje-inclinado': 'Empuje inclinado',
    'empuje-vertical': 'Empuje vertical',
    'aislamiento-pecho': 'Aislamiento de pecho',
    'traccion-vertical': 'Tracción vertical',
    'traccion-horizontal': 'Tracción horizontal',
    'deltoides-posterior': 'Deltoides posterior',
    'elevacion-lateral': 'Elevación lateral',
    'trapecio': 'Encogimientos',
    'lumbar': 'Extensión lumbar',
    'flexion-codo': 'Flexión de codo (bíceps)',
    'extension-codo': 'Extensión de codo (tríceps)',
    'antebrazo': 'Antebrazo',
    'dominante-rodilla': 'Dominante de rodilla',
    'extension-rodilla': 'Extensión de rodilla',
    'flexion-rodilla': 'Flexión de rodilla (isquios)',
    'extension-cadera': 'Extensión de cadera',
    'aduccion': 'Aducción',
    'abduccion': 'Abducción',
    'gemelo': 'Gemelo',
    'core': 'Core',
  };

  const EQUIPMENT = {
    'maquina': 'Máquina',
    'maquina-guiada': 'Barra guiada (Smith)',
    'barra-libre': 'Barra libre',
    'barra-z': 'Barra Z',
    'mancuerna': 'Mancuernas',
    'polea': 'Polea',
    'polea-keiser': 'Polea Keiser',
    'peso-corporal': 'Peso corporal',
  };

  // loadModel: 'external' = el peso escrito es la carga · 'bodyweight' = peso corporal + lastre escrito
  //            'none' = sin carga comparable (se sigue por reps)
  function ex(id, name, pattern, muscle, equipment, opts) {
    return Object.assign({ id, name, pattern, muscle, equipment, extraLoadKg: 0, loadModel: 'external', active: true }, opts || {});
  }

  const CATALOG = [
    // ── Tracción vertical
    ex('dominadas-cerradas', 'Dominadas cerradas', 'traccion-vertical', 'Dorsal', 'peso-corporal', { loadModel: 'bodyweight' }),
    ex('dominadas', 'Dominadas (agarre normal)', 'traccion-vertical', 'Dorsal', 'peso-corporal', { loadModel: 'bodyweight', active: false }),
    ex('jalon-abierto', 'Jalón abierto', 'traccion-vertical', 'Dorsal', 'polea', { active: false }),
    ex('jalon-pecho', 'Jalón al pecho', 'traccion-vertical', 'Dorsal', 'polea'),
    ex('jalon-cerrado', 'Jalón cerrado en polea', 'traccion-vertical', 'Dorsal', 'polea', { active: false }),
    // ── Tracción horizontal
    ex('remo-maquina-cerrado', 'Remo cerrado en máquina (R8)', 'traccion-horizontal', 'Espalda media', 'maquina', { active: false }),
    ex('remo-maquina-abierto', 'Remo abierto en máquina (R8)', 'traccion-horizontal', 'Espalda media', 'maquina', { active: false }),
    ex('remo-bajo-maquina', 'Remo bajo en máquina', 'traccion-horizontal', 'Espalda media', 'maquina'),
    ex('remo-polea-cerrado', 'Remo polea baja cerrado', 'traccion-horizontal', 'Dorsal', 'polea'),
    ex('remo-polea-abierto', 'Remo polea baja abierto', 'traccion-horizontal', 'Espalda media', 'polea'),
    ex('remo-mancuerna', 'Remo con mancuerna en banco', 'traccion-horizontal', 'Dorsal', 'mancuerna', { active: false }),
    ex('remo-alto-r9', 'Remo sentado codos altos (máquina R9, ~70 kg)', 'traccion-horizontal', 'Espalda alta', 'maquina', { active: false }),
    ex('remo-alto', 'Remo alto en máquina', 'traccion-horizontal', 'Espalda alta', 'maquina'),
    ex('pajaros-maquina', 'Pájaros en máquina', 'deltoides-posterior', 'Deltoides posterior', 'maquina', { active: false }),
    ex('encogimientos', 'Encogimientos con mancuernas', 'trapecio', 'Trapecio', 'mancuerna'),
    ex('lumbares', 'Extensiones lumbares en banco romano', 'lumbar', 'Erectores', 'peso-corporal', { active: false }),
    // ── Bíceps
    ex('curl-maquina-r8', 'Curl en máquina (R8)', 'flexion-codo', 'Bíceps', 'maquina', { active: false }),
    ex('curl-polea-r8', 'Curl en polea baja (R8)', 'flexion-codo', 'Bíceps', 'polea', { active: false }),
    ex('curl-polea', 'Curl polea baja (polea estándar)', 'flexion-codo', 'Bíceps', 'polea', { active: false }),
    ex('curl-polea-keiser', 'Curl polea baja (Keiser)', 'flexion-codo', 'Bíceps', 'polea-keiser', { variantOf: 'curl-polea' }),
    ex('curl-barra-z', 'Curl con barra Z de pie', 'flexion-codo', 'Bíceps', 'barra-z'),
    ex('curl-recta', 'Curl barra recta de pie', 'flexion-codo', 'Bíceps', 'barra-libre'),
    ex('curl-inclinado', 'Curl mancuernas banco inclinado', 'flexion-codo', 'Bíceps', 'mancuerna'),
    ex('curl-concentrado', 'Curl concentrado mancuerna', 'flexion-codo', 'Bíceps', 'mancuerna'),
    ex('curl-2poleas', 'Curl 2 poleas', 'flexion-codo', 'Bíceps', 'polea'),
    ex('curl-simultaneo', 'Curl simultáneo mancuernas', 'flexion-codo', 'Bíceps', 'mancuerna'),
    ex('antebrazo', 'Curl antebrazo barra', 'antebrazo', 'Antebrazo', 'barra-libre'),
    // ── Tríceps
    ex('triceps-polea', 'Tríceps en polea agarre prono (polea estándar)', 'extension-codo', 'Tríceps', 'polea', { active: false }),
    ex('triceps-polea-keiser', 'Tríceps en polea agarre prono (Keiser)', 'extension-codo', 'Tríceps', 'polea-keiser', { variantOf: 'triceps-polea' }),
    ex('triceps-1mano', 'Extensión polea 1 mano supino', 'extension-codo', 'Tríceps', 'polea'),
    ex('french-combo', 'Press francés + press cerrado barra Z', 'extension-codo', 'Tríceps', 'barra-z'),
    ex('french-polea', 'Press francés en polea', 'extension-codo', 'Tríceps', 'polea', { active: false }),
    ex('french-barra-z', 'Press francés barra Z', 'extension-codo', 'Tríceps', 'barra-z', { active: false }),
    ex('french-mancuernas', 'Press francés mancuernas', 'extension-codo', 'Tríceps', 'mancuerna'),
    ex('patada-triceps', 'Patada tríceps polea', 'extension-codo', 'Tríceps', 'polea'),
    ex('fondos-peso-corporal', 'Fondos para tríceps con peso corporal', 'extension-codo', 'Tríceps', 'peso-corporal', { loadModel: 'bodyweight' }),
    // ── Pecho / hombro
    ex('press-inclinado-guiada', 'Press inclinado barra guiada', 'empuje-inclinado', 'Pecho superior', 'maquina-guiada', { extraLoadKg: 15 }),
    ex('press-plano-maquina', 'Press plano en máquina (R8)', 'empuje-horizontal', 'Pecho', 'maquina', { active: false }),
    ex('press-sentado-maquina', 'Press sentado en máquina (pecho)', 'empuje-horizontal', 'Pecho', 'maquina'),
    ex('press-plano-barra', 'Press plano con barra', 'empuje-horizontal', 'Pecho', 'barra-libre'),
    ex('fondos-maquina', 'Fondos en máquina', 'empuje-horizontal', 'Pecho inferior / tríceps', 'maquina', { active: false }),
    ex('contractora', 'Contractora (pec deck)', 'aislamiento-pecho', 'Pecho', 'maquina', { active: false }),
    ex('cruces-polea', 'Cruces de poleas hacia abajo', 'aislamiento-pecho', 'Pecho', 'polea', { active: false }),
    ex('aperturas-inclinadas', 'Aperturas inclinadas con mancuernas', 'aislamiento-pecho', 'Pecho superior', 'mancuerna'),
    ex('flexiones-banco', 'Flexiones sobre banco', 'empuje-horizontal', 'Pecho', 'peso-corporal', { loadModel: 'none' }),
    ex('press-vertical-maquina', 'Press vertical en máquina', 'empuje-vertical', 'Deltoides anterior', 'maquina'),
    ex('lateral-mancuerna-pie', 'Elevaciones laterales mancuernas de pie', 'elevacion-lateral', 'Deltoides lateral', 'mancuerna', { active: false }),
    ex('lateral-mancuerna-sentado', 'Elevaciones laterales sentado mancuernas', 'elevacion-lateral', 'Deltoides lateral', 'mancuerna'),
    ex('lateral-maquina', 'Elevaciones laterales en máquina', 'elevacion-lateral', 'Deltoides lateral', 'maquina', { active: false }),
    ex('lateral-polea', 'Elevaciones laterales en polea', 'elevacion-lateral', 'Deltoides lateral', 'polea'),
    // ── Core
    ex('crunch-maquina', 'Crunch en máquina', 'core', 'Abdomen', 'maquina', { active: false }),
    ex('crunch-polea', 'Crunch en polea de pie', 'core', 'Abdomen', 'polea'),
    ex('elevaciones-piernas', 'Elevaciones de piernas', 'core', 'Abdomen', 'peso-corporal', { loadModel: 'none' }),
    ex('ab-wheel', 'Ab wheel de rodillas', 'core', 'Abdomen', 'peso-corporal', { loadModel: 'none' }),
    // ── Pierna
    ex('hip-thrust', 'Hip thrust', 'extension-cadera', 'Glúteo', 'barra-libre'),
    ex('prensa-inclinada', 'Prensa inclinada', 'dominante-rodilla', 'Cuádriceps', 'maquina'),
    ex('sentadilla-maquina-r8', 'Sentadilla máquina/hack/guiada (R8)', 'dominante-rodilla', 'Cuádriceps', 'maquina', { active: false }),
    ex('sentadilla-cinturon', 'Sentadilla con cinturón', 'dominante-rodilla', 'Cuádriceps', 'maquina'),
    ex('extension-cuadriceps', 'Extensión de cuádriceps en máquina', 'extension-rodilla', 'Cuádriceps', 'maquina'),
    ex('curl-femoral-r8', 'Curl femoral sentado/tumbado (R8)', 'flexion-rodilla', 'Isquios', 'maquina', { active: false }),
    ex('isquios-sentado', 'Curl femoral sentado en máquina', 'flexion-rodilla', 'Isquios', 'maquina'),
    ex('isquios-tumbado', 'Curl femoral tumbado en máquina', 'flexion-rodilla', 'Isquios', 'maquina', { active: false }),
    ex('gemelos-prensa', 'Gemelos en prensa', 'gemelo', 'Gemelo', 'maquina'),
    ex('aductores', 'Máquina aductores', 'aduccion', 'Aductores', 'maquina'),
    ex('abductores', 'Máquina abductores', 'abduccion', 'Glúteo medio', 'maquina'),
  ];

  /* Alias: nombre antiguo (+ trackId + rango de fechas) → id canónico.
     Orden importa: gana la primera regla que encaja. Fechas: from inclusive, to exclusiva.
     confidence: 'seguro' | 'dudoso' (los dudosos salen en la auditoría para revisarlos). */
  const ALIASES = [
    // Tracción vertical
    { names: ['Dominadas cerradas con lastre', 'Dominadas cerradas'], id: 'dominadas-cerradas', confidence: 'seguro' },
    { names: ['Dominadas con lastre'], id: 'dominadas', confidence: 'dudoso', note: 'R9 VIA 4: el PDF dice "dominadas con lastre", sin "cerradas". Si era el mismo agarre que R8/R10, cambia a dominadas-cerradas.' },
    { names: ['Jalón abierto'], id: 'jalon-abierto', confidence: 'seguro', note: 'Puede que sea la misma polea y agarre que "Jalón al pecho" (88 vs 85–98 kg). Si es así, fusiónalos.' },
    { names: ['Jalón al pecho'], id: 'jalon-pecho', confidence: 'seguro' },
    { names: ['Jalón cerrado en polea'], id: 'jalon-cerrado', confidence: 'seguro' },
    // Tracción horizontal
    { names: ['Remo cerrado en máquina'], id: 'remo-maquina-cerrado', confidence: 'seguro' },
    { names: ['Remo abierto en máquina'], id: 'remo-maquina-abierto', confidence: 'dudoso', note: '70 kg × 10, igual que "Remo bajo en máquina" de R9: ¿es la misma máquina?' },
    { names: ['Remo bajo en máquina'], trackIds: ['remo-maquina'], id: 'remo-bajo-maquina', confidence: 'seguro' },
    { names: ['Remo polea baja cerrado'], trackIds: ['remo-polea-cerrado'], id: 'remo-polea-cerrado', confidence: 'seguro' },
    { names: ['Remo polea baja abierto'], trackIds: ['remo-polea-abierto'], id: 'remo-polea-abierto', confidence: 'seguro' },
    { names: ['Remo con mancuerna en banco'], trackIds: ['remo-1brazo'], id: 'remo-mancuerna', confidence: 'seguro', note: 'Sustituyó a "Remo en punta o barra T" del PDF de R9.' },
    { names: ['Remo sentado máquina codos altos'], to: '2026-06-23', id: 'remo-alto-r9', confidence: 'dudoso', note: '70 kg en mayo–junio y 45 kg desde el 23 jun: parece otra máquina. ¿Fue cambio de máquina el 23 de junio?' },
    { names: ['Remo sentado máquina codos altos'], from: '2026-06-23', id: 'remo-alto', confidence: 'dudoso', note: 'Desde el 23 jun las cargas (45 kg) encajan con el remo alto de R10 (46–48 kg).' },
    { names: ['Remo alto en máquina'], id: 'remo-alto', confidence: 'seguro' },
    { names: ['Pájaros en máquina'], trackIds: ['rear-delt'], id: 'pajaros-maquina', confidence: 'seguro' },
    { names: ['Encogimientos con mancuernas', 'Encogimientos pesas', 'Encogimientos con pesas'], trackIds: ['trapecio'], id: 'encogimientos', confidence: 'seguro' },
    { names: ['Lumbares en banco', 'Extensiones en banco romano'], trackIds: ['lumbar'], id: 'lumbares', confidence: 'seguro' },
    // Bíceps
    { names: ['Curl en máquina'], id: 'curl-maquina-r8', confidence: 'seguro', note: 'El 4 may anotaste "BarraZ/banco": esa sesión quizá no fue en máquina.' },
    { names: ['Curl en polea baja'], id: 'curl-polea-r8', confidence: 'dudoso', note: 'R8: 10–17 kg con el comentario "con mancuernas en banco sentado". R9 en polea: 28 kg. Se separan.' },
    { names: ['Curl polea baja'], trackIds: ['curl-polea'], from: '2026-09-21', id: 'curl-polea-keiser', confidence: 'seguro', note: 'Comentario del 21 sep: "Cambio de máquina A KEISER".' },
    { names: ['Curl polea baja'], trackIds: ['curl-polea'], id: 'curl-polea', confidence: 'seguro' },
    { names: ['Curl barra Z de pie', 'Curl con barra Z'], trackIds: ['curl-barra'], id: 'curl-barra-z', confidence: 'seguro' },
    { names: ['Curl barra recta de pie', 'Curl barra de pie (barra recta)'], trackIds: ['curl-recta'], id: 'curl-recta', confidence: 'seguro' },
    { names: ['Curl mancuernas banco inclinado', 'Curl mancuernas simultáneo banco inclinado'], trackIds: ['curl-inclinado'], id: 'curl-inclinado', confidence: 'seguro' },
    { names: ['Curl concentrado mancuerna'], trackIds: ['curl-concentrado'], id: 'curl-concentrado', confidence: 'seguro' },
    { names: ['Curl 2 poleas'], trackIds: ['curl-2poleas'], id: 'curl-2poleas', confidence: 'seguro' },
    { names: ['Curl simultáneo mancuernas'], trackIds: ['curl-simultaneo'], id: 'curl-simultaneo', confidence: 'seguro' },
    { names: ['Curl antebrazo barra'], trackIds: ['antebrazo'], id: 'antebrazo', confidence: 'seguro' },
    // Tríceps
    { names: ['Tríceps en polea agarre prono', 'Extensiones en polea agarre prono', 'Extensiones polea agarre prono'], trackIds: ['triceps-pushdown'], to: '2026-07-01', id: 'triceps-polea', confidence: 'seguro', note: 'R9: 20–22 kg en la polea estándar.' },
    { names: ['Tríceps en polea agarre prono', 'Extensiones en polea agarre prono', 'Extensiones polea agarre prono'], trackIds: ['triceps-pushdown'], from: '2026-07-01', id: 'triceps-polea-keiser', confidence: 'dudoso', note: 'Desde R10, Keiser (comentario del 4 sep). Excepción: el 9 sep 15–21 kg, ¿otra polea ese día?' },
    { names: ['Extensiones polea 1 mano supino', 'Extensiones en polea a 1 mano agarre supino'], trackIds: ['triceps-1mano'], id: 'triceps-1mano', confidence: 'seguro' },
    { names: ['Press francés + Press cerrado barra Z'], trackIds: ['french-combo'], id: 'french-combo', confidence: 'seguro' },
    { names: ['Fondos tríceps peso propio', 'Fondos para tríceps con propio peso'], trackIds: ['fondos-bw'], id: 'fondos-peso-corporal', confidence: 'seguro' },
    { names: ['Press francés polea', 'Press francés en polea'], trackIds: ['french-polea'], id: 'french-polea', confidence: 'seguro' },
    { names: ['Press francés barra Z'], trackIds: ['french-barra'], id: 'french-barra-z', confidence: 'seguro' },
    { names: ['Press francés mancuernas'], trackIds: ['french-mancuernas'], id: 'french-mancuernas', confidence: 'seguro' },
    { names: ['Patada tríceps polea'], trackIds: ['patada-triceps'], id: 'patada-triceps', confidence: 'seguro' },
    // Pecho / hombro
    { names: ['Press inclinado barra'], id: 'press-inclinado-guiada', confidence: 'dudoso', note: 'R8: el PDF dice "barra guiada o libre". Mismos 28 kg que en R9 con guiada → se asume guiada (+15 kg).' },
    { names: ['Press inclinado barra guiada'], trackIds: ['press-inclinado'], id: 'press-inclinado-guiada', confidence: 'seguro' },
    { names: ['Press plano en máquina'], id: 'press-plano-maquina', confidence: 'dudoso', note: 'R8: 24–28 kg. El "Press sentado en máquina" de R9/R10 va a 50–60 kg: se separan.' },
    { names: ['Press vertical en máquina'], trackIds: ['press-vertical'], id: 'press-vertical-maquina', confidence: 'seguro', note: 'Se guardó con el trackId del press sentado: el nombre manda.' },
    { names: ['Press sentado en máquina'], trackIds: ['press-maquina'], id: 'press-sentado-maquina', confidence: 'seguro', note: 'Ojo al 23 may: 24–26 kg (en el resto de sesiones 50–60 kg).' },
    { names: ['Press plano con barra libre o guiada'], trackIds: ['press-plano'], id: 'press-plano-barra', confidence: 'dudoso', note: '¿Barra libre o guiada? Si es guiada hay que sumar 15 kg.' },
    { names: ['Fondos con lastre', 'Fondos en máquina'], trackIds: ['fondos'], id: 'fondos-maquina', confidence: 'dudoso', note: 'R8 anotado con 90–95 kg y el comentario "Máquina"; el 4 jun 0–10 kg. ¿Asistidos o lastrados?' },
    { names: ['Contractora'], trackIds: ['pec-fly'], id: 'contractora', confidence: 'seguro' },
    { names: ['Cruces de poleas hacia abajo'], trackIds: ['cruces'], id: 'cruces-polea', confidence: 'seguro' },
    { names: ['Aperturas inclinadas con mancuernas'], trackIds: ['aperturas-inclinadas'], id: 'aperturas-inclinadas', confidence: 'seguro' },
    { names: ['Flexiones sobre banco'], trackIds: ['flexiones-banco'], id: 'flexiones-banco', confidence: 'seguro' },
    { names: ['Elevaciones laterales mancuernas'], id: 'lateral-mancuerna-pie', confidence: 'dudoso', note: 'R8: el PDF no dice si de pie o sentado. Se asume de pie, como en R9.' },
    { names: ['Elev. laterales pesas de pie'], id: 'lateral-mancuerna-pie', confidence: 'seguro' },
    { names: ['Elev. laterales sentado mancuernas'], id: 'lateral-mancuerna-sentado', confidence: 'seguro' },
    { names: ['Elev. laterales en máquina'], trackIds: ['lateral-maquina'], id: 'lateral-maquina', confidence: 'seguro' },
    { names: ['Elevaciones laterales en polea'], trackIds: ['lateral-polea'], id: 'lateral-polea', confidence: 'seguro' },
    // Core
    { names: ['Crunch en máquina'], id: 'crunch-maquina', confidence: 'seguro' },
    { names: ['Crunch en polea de pie'], trackIds: ['abs-crunch'], id: 'crunch-polea', confidence: 'seguro' },
    { names: ['Elevaciones de piernas'], trackIds: ['abs-piernas'], id: 'elevaciones-piernas', confidence: 'seguro' },
    { names: ['Ab wheel de rodillas'], trackIds: ['abs-wheel'], id: 'ab-wheel', confidence: 'seguro', note: 'Algunas sesiones tienen 32–35 kg anotados: se ignoran (sin carga).' },
    // Pierna
    { names: ['Hip thrust'], trackIds: ['hip-thrust'], id: 'hip-thrust', confidence: 'seguro' },
    { names: ['Prensa inclinada'], trackIds: ['prensa'], id: 'prensa-inclinada', confidence: 'seguro' },
    { names: ['Sentadilla máquina/hack/guiada'], id: 'sentadilla-maquina-r8', confidence: 'dudoso', note: 'R8: 55 kg, después 60 (R9) y 65–73 (R10). Si fue la misma máquina de cinturón, fusiónalo.' },
    { names: ['Sentadilla cinturón/máquina/hack'], id: 'sentadilla-cinturon', confidence: 'dudoso', note: 'R9: el PDF permite cinturón, máquina o hack. Se asume cinturón.' },
    { names: ['Sentadilla con cinturón'], trackIds: ['sentadilla'], id: 'sentadilla-cinturon', confidence: 'seguro' },
    { names: ['Extensiones de rodillas', 'Cuádriceps en máquina'], trackIds: ['quad-extension'], id: 'extension-cuadriceps', confidence: 'seguro' },
    { names: ['Isquios sentado en máquina'], id: 'isquios-sentado', confidence: 'seguro' },
    { names: ['Isquios tumbado en máquina'], id: 'isquios-tumbado', confidence: 'seguro', note: 'Antes compartía id con el sentado: ahora se separan.' },
    { names: ['Curl femoral sentado/tumbado'], id: 'curl-femoral-r8', confidence: 'dudoso', note: 'R8: "sentado o tumbado". Si fue sentado, fusiónalo con isquios-sentado.' },
    { names: ['Gemelos en prensa', 'Gemelos en prensa horizontal'], trackIds: ['gemelos'], id: 'gemelos-prensa', confidence: 'seguro' },
    { names: ['Máquina aductores', 'Aductores en máquina'], trackIds: ['aductores'], id: 'aductores', confidence: 'seguro' },
    { names: ['Máquina abductores', 'Abductores en máquina'], trackIds: ['abductores'], id: 'abductores', confidence: 'seguro' },
  ];

  // ── Utilidades ───────────────────────────────────────────
  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/\s+/g, ' ').trim();
  }

  const _byId = {};
  CATALOG.forEach(e => { _byId[e.id] = e; });

  // Catálogo efectivo = base + variantes creadas desde la app (cambio de máquina).
  function getCatalog(custom) {
    const out = CATALOG.map(e => Object.assign({}, e));
    (custom || []).forEach(c => {
      const i = out.findIndex(e => e.id === c.id);
      if (i >= 0) out[i] = Object.assign(out[i], c); else out.push(Object.assign({ extraLoadKg: 0, loadModel: 'external', active: true }, c));
    });
    return out;
  }

  function getExercise(id, custom) {
    if (custom) { const c = custom.find(e => e.id === id); if (c) return Object.assign({}, _byId[id] || {}, c); }
    return _byId[id] || null;
  }

  // Sigue la cadena de cambios de máquina: {idViejo: {to, since}} → id vigente.
  function followSwaps(id, swaps) {
    const seen = new Set();
    while (swaps && swaps[id] && !seen.has(id)) { seen.add(id); id = swaps[id].to; }
    return id;
  }

  function inRange(date, from, to) {
    if (!date) return !from;
    if (from && date < from) return false;
    if (to && date >= to) return false;
    return true;
  }

  // Devuelve la regla de alias que aplica a un ejercicio guardado (o null).
  function resolveAlias(savedEx, date, aliases) {
    const list = aliases || ALIASES;
    const n = norm(savedEx.originalName || savedEx.name);
    const t = savedEx.trackId || null;
    // 1º por nombre (el nombre manda), 2º por trackId
    for (const r of list) {
      if (r.names && r.names.some(x => norm(x) === n) && inRange(date, r.from, r.to)) return r;
    }
    if (t) {
      for (const r of list) {
        if (r.trackIds && r.trackIds.includes(t) && inRange(date, r.from, r.to)) return r;
      }
    }
    return null;
  }

  function resolveExerciseId(savedEx, date) {
    if (savedEx && savedEx.exerciseId && savedEx.mappedBy !== 'alias') return savedEx.exerciseId;
    const r = resolveAlias(savedEx, date);
    return r ? r.id : (savedEx && savedEx.exerciseId) || null;
  }

  // ── Carga y e1RM ─────────────────────────────────────────
  function num(v) { const x = parseFloat(v); return isFinite(x) ? x : 0; }

  // Carga total de una serie. El dato bruto (weight) no se modifica nunca.
  function totalLoad(weight, exDef, bodyweight) {
    const w = num(weight);
    if (!exDef) return w;
    if (exDef.loadModel === 'none') return 0;
    if (exDef.loadModel === 'bodyweight') return bodyweight > 0 ? bodyweight + w : 0;
    return w > 0 ? w + (exDef.extraLoadKg || 0) : 0;
  }

  // Epley: 1RM = carga × (1 + reps/30). Por encima de 15 reps no es fiable → null.
  function epley(load, reps) {
    const r = parseInt(reps, 10);
    if (!(load > 0) || !(r > 0) || r > 15) return null;
    if (r === 1) return Math.round(load * 10) / 10;
    return Math.round(load * (1 + r / 30) * 10) / 10;
  }

  // Mejor serie de una sesión por e1RM (y la más pesada como respaldo).
  function bestSet(sets, exDef, bodyweight) {
    let best = null, top = null;
    (sets || []).forEach(s => {
      const load = totalLoad(s.weight, exDef, bodyweight);
      const reps = parseInt(s.reps, 10) || 0;
      if (load > 0 && reps > 0) {
        const e = epley(load, reps);
        if (e != null && (!best || e > best.e1rm)) best = { e1rm: e, load, reps, raw: num(s.weight) };
        if (!top || load > top.load || (load === top.load && reps > top.reps)) top = { load, reps, raw: num(s.weight) };
      }
    });
    return { best, top };
  }

  // ── Recorrido de datos ───────────────────────────────────
  function workoutEntries(store) {
    return Object.keys(store).filter(k => k.startsWith('workout-')).sort()
      .map(k => ({ key: k, data: store[k] }))
      .filter(e => e.data && Array.isArray(e.data.exercises));
  }

  function countStats(store) {
    let sessions = 0, exercises = 0, sets = 0, withId = 0, withOriginal = 0, filledSets = 0;
    workoutEntries(store).forEach(({ data }) => {
      sessions++;
      data.exercises.forEach(ex => {
        exercises++;
        if (ex.exerciseId) withId++;
        if (ex.originalName) withOriginal++;
        (ex.sets || []).forEach(s => { sets++; if (num(s.weight) > 0 || parseInt(s.reps, 10) > 0) filledSets++; });
      });
    });
    return { sessions, exercises, sets, filledSets, withId, withOriginal };
  }

  // ── Migración ────────────────────────────────────────────
  // Pura e idempotente: devuelve una copia. Los ejercicios que guardó la app con
  // exerciseId (mappedBy 'app') no se tocan; los que asignó un alias se re-resuelven,
  // así una corrección en ALIASES se propaga al volver a migrar.
  function migrate(store, opts) {
    const o = opts || {};
    const out = JSON.parse(JSON.stringify(store));
    const changes = [], unmapped = [];
    workoutEntries(out).forEach(({ key, data }) => {
      data.exercises.forEach((ex, i) => {
        if (ex.exerciseId && ex.mappedBy !== 'alias') return;
        const rule = resolveAlias(ex, data.date, o.aliases);
        if (!rule) {
          unmapped.push({ key, date: data.date, index: i, name: ex.name, trackId: ex.trackId || null });
          return;
        }
        const prev = ex.exerciseId || null;
        if (prev === rule.id && ex.originalName) return;
        if (!ex.originalName) ex.originalName = ex.name;
        ex.exerciseId = rule.id;
        ex.mappedBy = 'alias';
        ex.aliasConfidence = rule.confidence;
        changes.push({ key, date: data.date, index: i, name: ex.originalName, trackId: ex.trackId || null, from: prev, to: rule.id, confidence: rule.confidence });
      });
    });
    out['exercise-migration-meta'] = { catalogVersion: CATALOG_VERSION };
    return { store: out, changes, unmapped };
  }

  function validateMigration(before, after) {
    const a = countStats(before), b = countStats(after);
    const lostOriginal = [];
    workoutEntries(after).forEach(({ key, data }) => {
      const prev = before[key];
      data.exercises.forEach((ex, i) => {
        const p = prev && prev.exercises && prev.exercises[i];
        if (p && (ex.originalName || ex.name) !== (p.originalName || p.name)) lostOriginal.push({ key, index: i });
      });
    });
    const checks = [
      { label: 'Sesiones iguales', ok: a.sessions === b.sessions, detail: `${a.sessions} → ${b.sessions}` },
      { label: 'Ejercicios iguales', ok: a.exercises === b.exercises, detail: `${a.exercises} → ${b.exercises}` },
      { label: 'Series iguales', ok: a.sets === b.sets && a.filledSets === b.filledSets, detail: `${a.sets} → ${b.sets} (con datos: ${a.filledSets} → ${b.filledSets})` },
      { label: 'Ningún nombre original perdido', ok: lostOriginal.length === 0, detail: lostOriginal.length ? `${lostOriginal.length} cambiados` : 'OK' },
      { label: 'Ejercicios sin id', ok: b.exercises === b.withId, detail: `${b.exercises - b.withId} sin asignar` },
    ];
    return { before: a, after: b, checks, ok: checks.every(c => c.ok) };
  }

  // ── Auditoría ────────────────────────────────────────────
  // Una fila por combinación nombre + trackId, con el id asignado y saltos de carga ≥25 %.
  function audit(store, opts) {
    const o = opts || {};
    const groups = {};
    workoutEntries(store).forEach(({ data }) => {
      data.exercises.forEach(ex => {
        const name = ex.originalName || ex.name || '(sin nombre)';
        const k = name + '||' + (ex.trackId || '');
        const g = groups[k] || (groups[k] = { name, trackId: ex.trackId || '', sessions: 0, sets: 0, first: null, last: null, minW: null, maxW: null, minR: null, maxR: null, ids: {}, rules: {}, tops: [] });
        const filled = (ex.sets || []).filter(s => num(s.weight) > 0 || parseInt(s.reps, 10) > 0);
        g.sessions++;
        g.sets += filled.length;
        if (!g.first || data.date < g.first) g.first = data.date;
        if (!g.last || data.date > g.last) g.last = data.date;
        filled.forEach(s => {
          const w = num(s.weight), r = parseInt(s.reps, 10) || 0;
          if (w > 0) { g.minW = g.minW == null ? w : Math.min(g.minW, w); g.maxW = g.maxW == null ? w : Math.max(g.maxW, w); }
          if (r > 0) { g.minR = g.minR == null ? r : Math.min(g.minR, r); g.maxR = g.maxR == null ? r : Math.max(g.maxR, r); }
        });
        const top = Math.max(0, ...filled.map(s => num(s.weight)));
        if (top > 0) g.tops.push({ date: data.date, top });
        const rule = (ex.exerciseId && ex.mappedBy !== 'alias') ? null : resolveAlias(ex, data.date, o.aliases);
        const id = rule ? rule.id : (ex.exerciseId || null);
        g.ids[id || '—'] = (g.ids[id || '—'] || 0) + 1;
        if (rule) g.rules[rule.id] = rule;
        else if (ex.exerciseId) g.rules[ex.exerciseId] = { confidence: 'app' };
      });
    });
    return Object.values(groups).map(g => {
      g.tops.sort((a, b) => a.date.localeCompare(b.date));
      const jumps = loadJumps(g.tops);
      const ids = Object.keys(g.ids);
      const conf = ids.includes('—') ? 'sin asignar' : Object.values(g.rules).some(r => r.confidence === 'dudoso') ? 'dudoso' : Object.values(g.rules).every(r => r.confidence === 'app') ? 'app' : 'seguro';
      const notes = Object.values(g.rules).map(r => r.note).filter(Boolean);
      return { name: g.name, trackId: g.trackId, ids, confidence: conf, first: g.first, last: g.last, sessions: g.sessions, sets: g.sets, minW: g.minW, maxW: g.maxW, minR: g.minR, maxR: g.maxR, jumps, notes };
    }).sort((a, b) => (a.first || '').localeCompare(b.first || '') || a.name.localeCompare(b.name));
  }

  function loadJumps(series, threshold) {
    const th = threshold || 0.25, out = [];
    for (let i = 1; i < series.length; i++) {
      const a = series[i - 1].top, b = series[i].top;
      if (a > 0 && Math.abs(b - a) / a >= th) out.push({ date: series[i].date, from: a, to: b });
    }
    return out;
  }

  function auditToCsv(rows) {
    const esc = v => { const s = v == null ? '' : String(v); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const head = ['nombre', 'trackId', 'id_asignado', 'confianza', 'primera', 'ultima', 'sesiones', 'series', 'kg_min', 'kg_max', 'reps_min', 'reps_max', 'saltos_25pct', 'notas'];
    const lines = [head.join(',')];
    rows.forEach(r => lines.push([r.name, r.trackId, r.ids.join(' | '), r.confidence, r.first, r.last, r.sessions, r.sets, r.minW, r.maxW, r.minR, r.maxR,
      r.jumps.map(j => `${j.date}: ${j.from}→${j.to}`).join(' | '), r.notes.join(' / ')].map(esc).join(',')));
    return lines.join('\n');
  }

  return {
    CATALOG_VERSION, PATTERNS, EQUIPMENT, CATALOG, ALIASES,
    norm, getCatalog, getExercise, followSwaps, resolveAlias, resolveExerciseId,
    totalLoad, epley, bestSet, countStats, migrate, validateMigration, audit, auditToCsv, loadJumps,
  };
});
