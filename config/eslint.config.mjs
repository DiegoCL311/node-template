// config/eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  { name: 'ignores', ignores: ['dist/**', 'node_modules/**'] },

  // Reglas base JS
  js.configs.recommended,

  // Reglas base TS (sin type-check pesado)
  ...tseslint.configs.recommended,

  // Reglas generales (JS/TS)
  {
    name: 'project:rules',
    plugins: {
      import: importPlugin,
      unicorn,
      sonarjs,
      prettier,
    },
    // Resolver de imports para TypeScript (requiere eslint-import-resolver-typescript)
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./config/tsconfig.base.json'],
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',

      // Higiene de imports
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Complejidad y tamaño
      complexity: ['error', { max: 10 }],
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],

      // Unicorn (ajustes razonables)
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },

  // Overrides específicos para TS
  {
    name: 'ts-overrides',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        project: false, // sin type info para que sea rápido en pre-commit
      },
    },
    rules: {
      // 🔧 Desactivada porque requiere type information
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  }
);
