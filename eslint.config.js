import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['node_modules/*', 'dist/*', 'build/*', '*.config.js', '*.config.ts', 'public/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      ...tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'memberLike',
          modifiers: ['public'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'max-classes-per-file': ['error', 2],
      'no-empty': 'error',
      'no-multiple-empty-lines': 'error',
      'no-multi-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'object-shorthand': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'newline-before-return': 'error',
      curly: 'error',
    },
  },
);
