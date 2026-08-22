export default [
  {
    ignores: ['assets/**'],
    files: ['src/**/*.js', 'tests/**/*.js', 'playwright.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly', window: 'readonly', navigator: 'readonly', location: 'readonly',
        localStorage: 'readonly', matchMedia: 'readonly', URL: 'readonly', getComputedStyle: 'readonly',
        CSS: 'readonly', Intl: 'readonly'
      }
    },
    rules: {
      'no-eval': 'error',
      'no-new-func': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-constant-condition': 'error',
      'eqeqeq': ['error', 'always'],
      'no-implicit-globals': 'error'
    }
  },
  {
    files: ['sw.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        self: 'readonly', caches: 'readonly', URL: 'readonly', Response: 'readonly', fetch: 'readonly'
      }
    },
    rules: {
      'no-eval': 'error', 'no-new-func': 'error', 'no-undef': 'error',
      'no-unused-vars': 'error', 'eqeqeq': ['error', 'always']
    }
  }
];
