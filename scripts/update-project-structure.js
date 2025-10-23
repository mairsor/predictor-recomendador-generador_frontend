#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'estructura_proyecto.md');

function ignore(dir) {
  return [
    'node_modules',
    '.next',
    'out',
    '.git',
    'node_modules',
    'package-lock.json',
    'estructura_proyecto.md',
    'scripts',
  ].includes(dir);
}

function sortEntries(entries, dirPath) {
  const dirs = [];
  const files = [];
  entries.forEach((e) => {
    const full = path.join(dirPath, e);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) dirs.push(e);
      else files.push(e);
    } catch (_) {
      files.push(e);
    }
  });
  dirs.sort((a, b) => a.localeCompare(b));
  files.sort((a, b) => a.localeCompare(b));
  return [...dirs, ...files];
}

function tree(dir, prefix = '') {
  let items;
  try { items = fs.readdirSync(dir).filter((i) => i !== '.DS_Store'); } catch { return ''; }
  items = items.filter((i) => !ignore(i));
  items = sortEntries(items, dir);
  let out = '';
  items.forEach((item, idx) => {
    const isLast = idx === items.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    out += prefix + connector + item + '\n';
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        out += tree(full, newPrefix);
      }
    } catch (_) {}
  });
  return out;
}

const header = `# Estructura del proyecto (generada automáticamente)\n\nGenerado en: ${new Date().toISOString()}\n\n`;

const body = tree(ROOT);

fs.writeFileSync(OUT, header + body, 'utf8');
console.log('Wrote', OUT);
