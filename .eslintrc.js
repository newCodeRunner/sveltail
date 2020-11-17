module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: [
    'svelte3',
  ],
  ignorePatterns: [
    'public/',
    'dist/',
    'node_modules/',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off',
        'import/no-mutable-exports': 'off',
        'import/prefer-default-export': 'off',
        'no-labels': 'off',
        'no-restricted-syntax': 'off',
        'a11y-label-has-associated-control': 'off',
      },
    },
  ],
  rules: {
    'max-len': ['error', { code: 140 }],
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    //
  },
};
