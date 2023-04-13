module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'eslint-plugin-prettier'],
  extends: ['@react-native-community', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
