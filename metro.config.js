const extraNodeModules = require('node-libs-browser');

module.exports = {
  resolver: {
    extraNodeModules,
    sourceExts: ['jsx', 'js', 'ts', 'tsx']
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
};