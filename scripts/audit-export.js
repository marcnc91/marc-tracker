#!/usr/bin/env node
// Auditoría y migración de un backup exportado de la app, fuera del navegador.
// No hace falta para usar la app (la migración se ejecuta sola al abrirla); sirve
// para revisar los datos reales y los alias dudosos.
//
//   node scripts/audit-export.js marc-tracker-backup-AAAA-MM-DD.json [--csv auditoria.csv] [--out migrado.json]
const fs = require('fs');
const L = require('../exercises.js');

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
if (!file) { console.error('Uso: node scripts/audit-export.js backup.json [--csv auditoria.csv] [--out migrado.json]'); process.exit(1); }

const store = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = L.audit(store);
const { store: migrated, changes, unmapped } = L.migrate(store);
const v = L.validateMigration(store, migrated);

console.log(`\n${file}`);
console.log(`Combinaciones nombre+trackId: ${rows.length} · dudosas: ${rows.filter(r => r.confidence === 'dudoso').length} · sin asignar: ${rows.filter(r => r.confidence === 'sin asignar').length} · con saltos ≥25 %: ${rows.filter(r => r.jumps.length).length}`);
console.log(`Migración: ${changes.length} ejercicios reciben id (${changes.filter(c => c.confidence === 'dudoso').length} dudosos), ${unmapped.length} sin asignar`);
v.checks.forEach(c => console.log(`  ${c.ok ? '✓' : '✗'} ${c.label}: ${c.detail}`));
if (unmapped.length) {
  console.log('\nSin asignar (añadir a ALIASES en exercises.js):');
  [...new Map(unmapped.map(u => [u.name + '|' + u.trackId, u])).values()].forEach(u => console.log(`  - ${u.name}${u.trackId ? ` [${u.trackId}]` : ''} (${u.date})`));
}
const flagged = rows.filter(r => r.confidence === 'dudoso' || r.jumps.length);
if (flagged.length) {
  console.log('\nA revisar:');
  flagged.forEach(r => console.log(`  - ${r.name}${r.trackId ? ` [${r.trackId}]` : ''} → ${r.ids.join(', ')} · ${r.first}…${r.last} · ${r.minW ?? '-'}–${r.maxW ?? '-'} kg${r.jumps.length ? ' · saltos: ' + r.jumps.map(j => `${j.date} ${j.from}→${j.to}`).join(', ') : ''}`));
}
const csv = opt('--csv'); if (csv) { fs.writeFileSync(csv, '﻿' + L.auditToCsv(rows)); console.log(`\nCSV: ${csv}`); }
const out = opt('--out'); if (out) { fs.writeFileSync(out, JSON.stringify(migrated, null, 2)); console.log(`Migrado: ${out}`); }
process.exitCode = v.checks.filter(c => c.key !== 'ids').every(c => c.ok) ? 0 : 1;
