const { defineConfig } = require('eslint/config');
const { FlatCompat } = require('@eslint/eslintrc');
const prettierConfig = require('eslint-config-prettier');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettierConfig,
  {
    ignores: [
      '.next/**',
      '.expo/**',
      'legacy-expo-src/**',
      'node_modules/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
    ],
  },
]);
