const extraNodeModules = require('node-libs-browser');

/*module.exports = {
  resolver: {
    extraNodeModules,
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs']
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
};*/

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push(
  // Adds support for `.db` files for SQLite databases
  'jsx', 'js', 'ts', 'tsx', 'cjs'
);
config.resolver.extraNodeModules = extraNodeModules;
config.transformer.assetPlugins.push(
  'expo-asset/tools/hashAssetFiles'
)

module.exports = config;