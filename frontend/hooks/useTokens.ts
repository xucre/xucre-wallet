import { useEffect, useState } from 'react';
import { Token, TokenMap, TokenPrice } from '../service/token';

import _ethTokens from '../../assets/json/eth_tokens.json'
import _polygonTokens from '../../assets/json/matic_tokens.json'
import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getTokenBalances, getTokenPrices } from '../service/api';
import { chainIdToNameMap, xucreToken, testWallet } from '../service/constants';
import { getActiveNetwork } from '../store/network';
import { isSpam } from '../store/spam';
import { getActiveWallet, WalletInternal } from '../store/wallet';
import { activeNetwork, activeWallet, AppWallet, tokenPricesTotal, tokenTotal } from '../service/state';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getTokenItems, getTokenPriceMap, storeTokenItems, storeTokenPriceMap } from '../store/tokenItem';
import { chainIdToNetworkMap, constructDefaultNetworks } from '../service/network';
import { useToast } from 'native-base';

function useTokens(initialValue = [] as Token[]) {
  const [tokensLoading, setTokensLoading] = useState(false);
  const [fulltokens, setTokens] = useRecoilState(tokenTotal);
  const tokens = Object.values(fulltokens).length > 0 ? Object.values(fulltokens).flatMap((tList) => tList) : [] as Token[];
  const [tokenPrices, setTokenPrices] = useRecoilState(tokenPricesTotal);
  const toast = useToast();

  const wallet = useRecoilValue(activeWallet);
  
  const syncTokens = async (save: boolean, chainId: number) => {
    try {
      const _networkMap = chainIdToNetworkMap();
      const _network = _networkMap[chainId];
      const tokenMetadataMap = chainId === 1 ? _ethTokens : chainId === 137 ? _polygonTokens : {};

      const _provider = getDefaultProvider(_network.rpcUrl);
      const _wallet = (await getActiveWallet())[0] as AppWallet;
      const wallet = new WalletInternal(_wallet.wallet).connect(_provider);
      //const walletAddress = __DEV__ ? testWallet : wallet.address;
      const walletAddress = wallet.address;
      const tokenResponse = (await getTokenBalances(walletAddress.toLowerCase(), chainIdToNameMap[chainId as keyof typeof chainIdToNameMap]));

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
        if (save) setTokens(prevState => {return{...prevState,  [chainId] : [coinToken]}});
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
          if (save) setTokens(prevState => {return{...prevState,  [chainId] : [xucreToken, coinToken]}});
          return [xucreToken, coinToken];
        }
        if (save) setTokens(prevState => {return{...prevState,  [chainId] : [coinToken]}});
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
        if (save) setTokens(prevState => {return{...prevState,  [chainId] : finalTokens}});
        return finalTokens;
      }
    } catch (err) {
      //console.log(err);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {  
      try{
        if (isMounted) setTokensLoading(true);
        let _tokenList = {} as {[key:number] : Token[]};
        Promise.allSettled(Object.keys(chainIdToNameMap).map(async (chainId) => {
          if (chainId === '0') return;
          const _tokens = await syncTokens(false, Number(chainId));
          return _tokens;
          //_tokenList = {..._tokenList, [chainId]: _tokens};
          //if (isMounted) setTokens(prevState => {return{...prevState,  [chainId] : _tokens}});
        })).then((tokens) => {
          tokens.forEach((token, index) => {
            if (token.status === 'fulfilled' && token.value && token.value.length > 0) {
              _tokenList = {..._tokenList, [token.value[0].chainId]: token.value};
            }
          });
          //console.log(_tokenList)
          if (isMounted) setTokens(_tokenList);
          if (isMounted) setTokensLoading(false);
        });
      } catch (err) {}
    }
    
    runAsync();
    return () => { isMounted = false;}
  }, [wallet]);

  useEffect(() => {
    let isMounted = true;
    const runAsync2 = async () => {
      try {
        //const walletAddress = __DEV__ ? testWallet : wallet.address;
        const walletAddress = wallet.address;
        Promise.allSettled(Object.keys(chainIdToNameMap).map(async (chainId) => {
          if (chainId === '0') return null;
          if (isMounted) await storeTokenItems(walletAddress, Number(chainId), tokens.filter(token => token && token.chainId === Number(chainId)));
          const _tokenPrices = await getTokenPrices(Number(chainId), tokens.filter(token => token && token.chainId === Number(chainId)).map(token => token.address));
          const _tokenPriceMap = _tokenPrices.reduce((acc: { [key: string]: TokenPrice }, _tokenPrice: any) => {
            const tokenPrice = {
              address: _tokenPrice.address,
              chainId: chainId,
              price: _tokenPrice.items[0].price,
              prettyPrice: _tokenPrice.items[0].prettyPrice
            } as TokenPrice;
            return {
              ...acc,
              [`${_tokenPrice.address.toLowerCase()}:${chainId}`]: tokenPrice
            } as TokenMap
          }, {} as TokenMap);
          //if (isMounted) setTokenPrices(previousValue => {return{...previousValue,  [Number(chainId)] : _tokenPriceMap}});
          if (isMounted) await storeTokenPriceMap(walletAddress, Number(chainId), _tokenPriceMap);
          return _tokenPriceMap;
        })).then((tokenPrices_) => {
          let _priceListTotal = {} as { [key:number] : TokenMap};
          tokenPrices_.forEach((tokenPrice, index) => {
            if (tokenPrice.status === 'fulfilled' && tokenPrice.value && Object.keys(tokenPrice.value).length > 0) {
              const _priceList = tokenPrice.value as TokenMap
              _priceListTotal = {..._priceListTotal, [Number(Object.values(_priceList)[0].chainId)]: _priceList};
            }
          })
          if (isMounted) setTokenPrices(_priceListTotal);
        });
      } catch (err) {
        toast.show({title: 'Error', description: `Error fetching token prices ${JSON.stringify(err)}`, duration: 10000})
      }
    }
    if (tokens.length > 0 ) {
      runAsync2();
    }
    
    return () => { isMounted = false;}
  }, [fulltokens]);

  const reset = async (save: boolean) => {
    Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      syncTokens(save, Number(chainId));
    });
  }

  //useEffect(() => {console.log(`token prices updated `, tokenPrices)}, [tokenPrices]);


  return { tokenPrices, tokens, reset };
}

export default useTokens;