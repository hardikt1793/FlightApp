module.exports = {
  root: true,
  extends: '@react-native',
  settings: {
    'import/resolver': {
      node: {
        paths: ['app'],
      },
    },
  },
};
