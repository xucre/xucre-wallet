import { useEffect, useState } from 'react';
import { Token } from '../service/token';

import ethTokens from '../../assets/json/eth_tokens.json'
import polygonTokens from '../../assets/json/matic_tokens.json'
import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getTokenBalances } from '../service/api';
import { chainIdToNameMap, xucreToken } from '../service/constants';
import { getActiveNetwork } from '../store/network';
import { isSpam } from '../store/spam';
import { getActiveWallet, WalletInternal } from '../store/wallet';
import { activeNetwork, activeWallet, AppWallet } from '../service/state';
import { BIOMETRY_TYPE } from 'react-native-keychain';
import { useRecoilValue } from 'recoil';

function useTokens(initialValue = [] as Token[]) {
  const [tokens, setTokens] = useState(initialValue);
  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);
  
  const syncTokens = async (save: boolean) => {
    try {
      const _network = await getActiveNetwork();
      const tokenMetadataMap = _network.chainId === 1 ? ethTokens : _network.chainId === 137 ? polygonTokens : {};

      const _provider = getDefaultProvider(_network.rpcUrl);
      const _wallet = (await getActiveWallet())[0] as AppWallet;
      const wallet = new WalletInternal(_wallet.wallet).connect(_provider);
      const tokenResponse = (await getTokenBalances(_wallet.address.toLowerCase(), chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap]));

      const walletBalance = await wallet.connect(_provider).getBalance();
      if (tokenResponse === null) {
        const coinToken = {
          address: ethers.constants.AddressZero,
          amount: walletBalance || BigNumber.from(0),
          chainId: _network.chainId,
          name: _network.name,
          symbol: _network.symbol || 'NA',
          type: 'coin',
          isNotSpammable: true
        };
        if (save) setTokens([coinToken]);
        return [coinToken];
      }
      const _tokens_original = tokenResponse.tokenBalances;
      const _tokens = _tokens_original.filter((token: { tokenBalance: string; contractAddress: string; }) => BigNumber.from(token.tokenBalance).gt(0));
      
      //const walletBalance = await wallet.connect(_provider).getBalance();

      const coinToken = {
        address: ethers.constants.AddressZero,
        amount: walletBalance,
        chainId: _network.chainId,
        name: _network.name,
        symbol: _network.symbol || 'NA',
        type: 'coin',
        isNotSpammable: true
      };
      if (!_tokens) {
        if (_network.chainId === xucreToken.chainId) {
          if (save) setTokens([xucreToken, coinToken]);
          return [xucreToken, coinToken];
        }
        if (save) setTokens([coinToken]);
        return [coinToken];        
      } else {
        const _tokenList = await _tokens.reduce(async (_tList: Token[], token: { contractAddress: string; tokenBalance: any; }) => {
          const tokenMetadata = tokenMetadataMap[token.contractAddress.toLowerCase() as keyof typeof tokenMetadataMap];
          const _token = ethers.utils.getAddress(token.contractAddress) === ethers.utils.getAddress(xucreToken.address) ? 
          {
            name: xucreToken.name,
            amount: BigNumber.from(token.tokenBalance || 0),
            chainId: _network.chainId,
            address: ethers.utils.getAddress(xucreToken.address),
            type: 'token',
            logo: 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png',
            symbol: 'XUCRE',
            isNotSpammable: false
          } as Token :
          {
            //@ts-ignore
            name: tokenMetadata?.name || 'N/A',
            amount: BigNumber.from(token.tokenBalance || 0),
            chainId: _network.chainId,
            address: token.contractAddress,//ethers.utils.getAddress(token.contractAddress),
            type: 'token',
            //@ts-ignore
            logo: tokenMetadata?.logo || undefined,
            //@ts-ignore
            symbol: tokenMetadata?.symbol || 'N/A',
            isNotSpammable: false
          } as Token;
          const tlist = await _tList;
          if (!(await isSpam(token.contractAddress, _network.chainId))) {
            return [...tlist, _token];
          }
          return tlist;
        }, Promise.resolve([] as Token[])) as Token[];
        const tokenList = [..._tokenList, coinToken];
        const finalTokens = tokenList.sort((a, b) => {
          if (a.amount && b.amount) {
            return (a.amount.gt(b.amount)) ? -1 : 1
          } else if (a) {
            return -1;
          } else {
            return 1;
          }
        });
        if (save) setTokens(finalTokens);
        return finalTokens;
      }
    } catch (err) {
      //console.log(err);
    }

  }
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _tokens = await syncTokens(false);
      if (isMounted) setTokens(_tokens as Token[]);
    }
    
    runAsync();
    return () => { isMounted = false;}
  }, [wallet, network]);


  return { tokens, reset: syncTokens };
}

export default useTokens;