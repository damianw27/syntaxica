module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      env: {
        es2021: true,
        browser: true,
        jest: true,
      },
      extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'prettier'],
      plugins: ['prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            trailingComma: 'all',
            tabWidth: 2,
            semi: true,
            singleQuote: true,
            printWidth: 120,
          },
        ],
        'max-nested-callbacks': 'off',
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'import/extensions': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      files: '*.js',
      env: {
        node: true,
      },
      extends: ['airbnb-base', 'prettier'],
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            trailingComma: 'all',
            tabWidth: 2,
            semi: true,
            singleQuote: true,
            printWidth: 120,
          },
        ],
        'import/extensions': 'off',
      },
    },
  ],
};
