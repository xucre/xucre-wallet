const fs = require('fs/promises');
const ethTokens = require('../assets/json/ethereum.tokenlist.json');
const polygonTokens = require('../assets/json/polygon.tokenlist.json');

const runAsyncEthList = async () => {
  const convertedTokens = Object.keys(ethTokens).reduce((finalVal, tokenSymbol, index) => {
    const token = ethTokens[tokenSymbol];
    return {
      ...finalVal,
      [token.address] : {
        address: token.address,
        chainId: 1,
        name: token.name,
        logo: token.logo?.src || '',
        symbol: tokenSymbol,
      }
    }
  }, {})

  await fs.writeFile('../assets/json/eth_tokens.json', JSON.stringify(convertedTokens, null, 2));
}

const runAsyncPolygonList = async () => {
  const convertedTokens = polygonTokens.tokens.reduce((finalVal, token, index) => {
    return {
      ...finalVal,
      [token.address] : {
        address: token.address,
        chainId: 137,
        name: token.name,
        logo: token.logoURI || '',
        symbol: token.symbol
      }
    }
  }, {})

  await fs.writeFile('../assets/json/matic_tokens.json', JSON.stringify(convertedTokens, null, 2));
}

runAsyncEthList();
