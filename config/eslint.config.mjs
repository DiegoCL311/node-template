// config/eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';

export default tseslint.config(
  {
    name: 'ignores',
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'coverage/**', 'src/loaders/banner.ts'],
  },

  // Reglas base JS
  js.configs.recommended,

  // Reglas base TS (sin type-check)
  ...tseslint.configs.recommended,

  // sonarjs.configs.recommended,

  {
    name: 'project:rules',
    plugins: {
      import: importPlugin,
      unicorn,
      sonarjs,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },
    rules: {
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
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],

      // Ignorar argumentos y variables con prefijo `_` (convención para
      // parámetros requeridos por la firma pero no usados, p.ej. `_next` en
      // middlewares de error de Express).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',

      // Reglas relajadas para mantener compatibilidad con el código heredado
      // del template (ApiError, jwt, mysql, asyncErrorHandler) y permitir
      // evoluciones pragmáticas.
      '@typescript-eslint/no-explicit-any': 'off',
      'no-explicit-any': 'off',
      'no-irregular-whitespace': 'off',
      'no-useless-catch': 'off',

      // Unicorn
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
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Override específico: banner.ts contiene arte ASCII con escapes
  // deliberados ($, \, etc.) que disparan no-useless-escape. Sin esto,
  // el banner se rompe visualmente en consola.
  {
    name: 'banner-override',
    files: ['src/loaders/banner.ts'],
    rules: {
      'no-useless-escape': 'off',
      'no-console': 'off',
    },
  },
);
