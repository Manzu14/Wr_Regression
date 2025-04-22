// QMO Eslint configuration
import globals from 'globals';

// eslint plugins
import ban from 'eslint-plugin-ban';
import eslintImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';
import chaiFriendly from 'eslint-plugin-chai-friendly';
import sortRequiresByPath from 'eslint-plugin-sort-requires-by-path';

// project path
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .gitignore
import { includeIgnoreFile, fixupPluginRules } from '@eslint/compat';
const gitignorePath = path.resolve(__dirname, '.gitignore');

// default eslint rules
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';

// legacy rules
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({
    baseDirectory: __dirname,
    name: 'eslintDefaults',
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

// flatfile
export default [
    ...compat.extends('prettier'),
    ...compat.extends('plugin:playwright/recommended'),
    includeIgnoreFile(gitignorePath),
    {
        name: 'QMOTestsExamplesIgnores',
        ignores: [
            'tests/examples/console-log.spec.js', // Ignore the console log as it used for showcasing debug
            'tests/examples/playwright-test.spec.js', // Ignore the console log as it used for showcasing debug
            'tests/examples/grep.spec.js', // Ignore the console log as it used for showcasing debug
        ],
    },
    {
        name: 'QMO-lint-settings',
        plugins: {
            prettier,
            'chai-friendly': chaiFriendly,
            ban,
            'sort-requires-by-path': sortRequiresByPath,
            import: fixupPluginRules(eslintImport),
            playwright,
            '@stylistic/js': stylisticJs,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 2023,
            sourceType: 'module',
        },
        settings: {
            'import/resolver': {
                node: {
                    caseSensitive: true,
                },
            },
        },
        rules: {
            camelcase: 'error',
            eqeqeq: 'error',
            '@stylistic/js/comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'always-multiline',
                },
            ],
            '@stylistic/js/eol-last': 'warn',
            '@stylistic/js/lines-between-class-members': [
                'error',
                'always',
                {
                    exceptAfterSingleLine: true,
                },
            ],
            '@stylistic/js/no-multi-spaces': 'warn',
            '@stylistic/js/space-before-function-paren': 'off',
            'array-callback-return': 'warn',
            'ban/ban': [
                2,
                {
                    name: ['describe', 'only'],
                    message: 'Avoid "only" method.',
                },
                {
                    name: ['it', 'only'],
                    message: 'Avoid "only" method.',
                },
            ],
            'chai-friendly/no-unused-expressions': 2,
            'import/no-unresolved': 'error',
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                },
            ],
            'import/no-cycle': [
                2,
                {
                    maxDepth: 1,
                },
            ],
            'no-async-promise-executor': 'off',
            'no-console': 'warn',
            'no-new': 'off',
            'no-unused-expressions': 0,
            'no-var': 'error',
            'playwright/prefer-locator': 1,
            'playwright/prefer-native-locators': 1,
            'playwright/prefer-to-have-count': 1,
            'prefer-const': 'warn',
            'prefer-promise-reject-errors': 'off',
            'prettier/prettier': ['error'],
            'sort-requires-by-path/sort-requires-by-path': 2,
        },
    },
];
