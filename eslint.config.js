// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import importPlugin from 'eslint-plugin-import'
// import unusedImports from 'eslint-plugin-unused-imports'

// export default tseslint.config(
//   {
//     ignores: ['dist', 'node_modules', 'vite.config.ts'],
//   },
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ['**/*.{ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//       'import': importPlugin,
//       'unused-imports': unusedImports,
//     },
//     rules: {
//       // ✅ Unused import removal
//       'unused-imports/no-unused-imports': 'error',
//       'unused-imports/no-unused-vars': [
//         'warn',
//         {
//           vars: 'all',
//           varsIgnorePattern: '^_',
//           args: 'after-used',
//           argsIgnorePattern: '^_',
//         },
//       ],

//       // ✅ React Hooks best practices
//       ...reactHooks.configs.recommended.rules,

//       // ✅ Vite + React Refresh
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],

//       // ✅ Import plugin rules (missing deps, unresolved modules)
//       'import/no-unresolved': 'error',
//       'import/no-extraneous-dependencies': [
//         'error',
//         {
//           devDependencies: [
//             '**/*.test.{ts,tsx}',
//             '**/*.spec.{ts,tsx}',
//             '**/vite.config.ts',
//             '**/postcss.config.js',
//             '**/tailwind.config.js',
//           ],
//           optionalDependencies: false,
//           peerDependencies: false,
//         },
//       ],
//       'import/order': [
//         'warn',
//         {
//           alphabetize: { order: 'asc', caseInsensitive: true },
//           'newlines-between': 'always',
//         },
//       ],
//     },
//     settings: {
//       'import/resolver': {
//         typescript: {},
//       },
//     },
//   },
// )
