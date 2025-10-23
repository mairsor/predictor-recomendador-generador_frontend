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

function tree(dir, depth = 0) {
  const items = fs.readdirSync(dir).filter((i) => i !== '.DS_Store');
  let out = '';
  items.forEach((item) => {
    if (ignore(item)) return;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    out += '  '.repeat(depth) + '- ' + item + '\n';
    if (stat.isDirectory()) {
      out += tree(full, depth + 1);
    }
  });
  return out;
}

const header = `# Estructura del proyecto (generada automáticamente)\n\nGenerado en: ${new Date().toISOString()}\n\n`;

const body = tree(ROOT);

fs.writeFileSync(OUT, header + body, 'utf8');
console.log('Wrote', OUT);
