const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce((acc, rule) => {
  acc[`jsx-a11y/${rule}`] = 'off';
  return acc;
}, {});

module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  env: {
    'cypress/globals': true,
  },
  plugins: ['react', 'cypress'],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  rules: {
    ...a11yOff,
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/test/**', '**/*.test.*', '**/*.spec.*'] },
    ],
    'import/export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/indent': 'off',
  },
};
