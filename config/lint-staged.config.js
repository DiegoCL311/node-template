// config/lint-staged.config.js
const path = require('node:path');

const ROOT = process.cwd();
const ESLINT_CFG = path.join(ROOT, 'config', 'eslint.config.mjs');
const PRETTIER_CFG = path.join(ROOT, 'config', 'prettier.config.cjs');

const quote = (p) => `"${p}"`;

module.exports = {
  '*.{ts,tsx}': (files) => {
    const list = files.map(quote).join(' ');
    return [
      `eslint --fix --config ${quote(ESLINT_CFG)} ${list}`,
      `prettier --write --config ${quote(PRETTIER_CFG)} ${list}`,
    ];
  },
  '*.{js,json,md,yml,yaml}': (files) => {
    const list = files.map(quote).join(' ');
    return `prettier --write --config ${quote(PRETTIER_CFG)} ${list}`;
  },
};
