module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@root': './',
          '@components': './app/components',
          '@screens': './app/screens',
          '@utils': './app/utils',
          '@hooks': './app/hooks',
          '@services': './app/services',
          '@assets': './app/assets',
          '@navigation': './app/navigation',
          '@config/*': ['app/config/*'],
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
