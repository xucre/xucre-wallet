/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0xcab9eb062425fb8ef87fc0e447a6cd2dbbd14bd95c6b03a3daed5c2a1b435ab6","balance":"1000000000000000000000"},{"privateKey":"0x0c6461130b027002b2245b59c08fbcfff4ab7419d9b12dad7146e3114453388f","balance":"1000000000000000000000"},{"privateKey":"0x3def43f7f82ebef851109c9414bd351a06fc00aa345effc8b6dbca57ee76f1aa","balance":"1000000000000000000000"},{"privateKey":"0x3c0a03431109a92e9bee55ec0e82614fd48cd35325e0d65850296b2163e27655","balance":"1000000000000000000000"},{"privateKey":"0x877c8ea8c689624484d615b3a96936eca2da261d687fc35ea9fd4dab3475979e","balance":"1000000000000000000000"},{"privateKey":"0xead99bb5ab8455abd570cf604efbb08e606acece6b72708ebf5322f3e4fe697e","balance":"1000000000000000000000"},{"privateKey":"0x341bcec49d2b410b49d3ee6d900ef034b699e1cdb7a32ab5dbbc147cee6c038a","balance":"1000000000000000000000"},{"privateKey":"0x866f5e07a1f0faae4ec761f3cb1874eaecc836af782af6fc54606dc89d7a49ae","balance":"1000000000000000000000"},{"privateKey":"0xad92637983028774f8fa03436e6e1176d284c916d9686df6273a9b5835828c64","balance":"1000000000000000000000"},{"privateKey":"0x9ed45baac8cb7bb4b9540329061c2dc3e57c6248499b16a7d2a503df561b8dc7","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};