module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'jest', 'prettier', 'simple-import-sort', 'import'],
    env: {
        node: true,
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    rules: {
        'prettier/prettier': 'error',
        'simple-import-sort/sort': 'error',

        /**
         * @typescript-eslint
         */
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/class-name-casing': 'warn',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/prefer-interface': 'off',
    },
};
