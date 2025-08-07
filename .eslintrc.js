module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Remove unused imports
    'unused-imports/no-unused-imports': 'error',

    // Remove unused variables but allow ones starting with _
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Optionally disable these if you prefer
    '@typescript-eslint/no-unused-vars': 'off',
    'react/prop-types': 'off',
  },
};
