module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-private-property-in-object', {loose: true}],
      ['module:react-native-dotenv'],
      ["@babel/plugin-syntax-bigint", {loose: true}],
      ["@babel/plugin-transform-private-methods", {loose: true}]
    ],
  };
};