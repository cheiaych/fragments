module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "ignorePatterns": [
        'tests/integration/'
    ],
    "rules": {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unused-vars': "off",
        '@typescript-eslint/no-redeclare': "off"
    }
}
