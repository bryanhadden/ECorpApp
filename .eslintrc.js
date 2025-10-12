module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
    jest: true,
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-raw-text': 'off',
    'react-native/no-color-literals': 'warn',

    // General code quality rules
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    curly: ['error', 'all'],
    eqeqeq: ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Import/Export rules
    'no-duplicate-imports': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],

    // Formatting (if not using Prettier)
    indent: 'off', // Let Prettier handle this
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'as-needed'],
    'max-len': [
      'warn',
      {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'coverage/',
    'build/',
    '.bundle/',
    'vendor/',
    '*.config.js',
    '.eslintrc.js',
    'metro.config.js',
    'babel.config.js',
    'commitlint.config.js',
    'index.js',
    '.prettierrc.js',
  ],
};
