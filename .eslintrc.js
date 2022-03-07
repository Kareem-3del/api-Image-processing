module.exports = {
    "env": {
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "rules": {

    },
        "overrides": [
            {

                "files": ['*.ts', '*.tsx'], // Your TypeScript files extension

                // As mentioned in the comments, you should extend TypeScript plugins here,
                // instead of extending them outside the `overrides`.
                // If you don't want to extend any rules, you don't need an `extends` attribute.
                "extends": [
                    "eslint:recommended",
                    "plugin:@typescript-eslint/recommended",
                    "plugin:@typescript-eslint/recommended-requiring-type-checking",
                ],

                "parserOptions": {
                    "project": ['./tsconfig.json'], // Specify it only for TypeScript files
                },
            },
        ],

    }
