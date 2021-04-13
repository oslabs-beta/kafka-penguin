module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-plugin',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react-hooks',
    'prettier',
  ],
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'arrow-parens': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'no-console': 'off',
    radix: 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'linebreak-style': ['error', 'windows'],
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-use-before-define":"off"
  },

};
