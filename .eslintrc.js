module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:prettier/recommended', 'prettier/react'], // 'plugin:jest/recommended', 'plugin:lodash/canonical',
  plugins: ['prettier'], // 'jest', 'jsdoc', 'json', 'lodash',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {},
};
