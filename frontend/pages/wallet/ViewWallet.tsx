import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from 'ethers';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Icon,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
//import { TokenBalancesListView } from "@covalenthq/goldrush-kit";


import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import TokenItem from '../../components/token/TokenItem';
import TotalBalance from "../../components/wallet/TotalBalance";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getTokenBalances, getWalletTransactions } from "../../service/api";
import { chainIdToNameMap, xucreToken } from "../../service/constants";
import { activeNetwork, activeWallet, language as stateLanguage, walletList } from '../../service/state';
import { CovalentTransaction } from "../../service/transaction";
import { Token } from "../../service/token";
import { WalletInternal } from "../../store/wallet";
import { getActiveNetwork } from "../../store/network";
import { Color } from "../../../GlobalStyles";
import ethTokens from '../../assets/json/eth_tokens.json'
import polygonTokens from '../../assets/json/matic_tokens.json'
import { useIsFocused } from '@react-navigation/native';

export default function ViewWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ViewWallet.tab_list[0]);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const network = useRecoilValue(activeNetwork);
  const [tokens, setTokens] = useState([] as Token[]);
  const [transactions, setTransactions] = useState([] as readonly CovalentTransaction[]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      //setIsComponentMounted(false);
    }
  }, []);
  const tabList = translations[language as keyof typeof translations].ViewWallet.tab_list;
  //Buttons

  const buttonSend = translations[language as keyof typeof translations].Buttons_Header.send;
  const buttonReceive = translations[language as keyof typeof translations].Buttons_Header.receive;
  const buttonBuy = translations[language as keyof typeof translations].Buttons_Header.buy;
  //const buttonNft = translations[language as keyof typeof translations].Buttons_Header.nft;
  const buttonConnect = translations[language as keyof typeof translations].Buttons_Header.connect;

  const tokenMetadataMap = network.chainId === 1 ? ethTokens : network.chainId === 137 ? polygonTokens : {};

  const syncTokens = async () => {
    try {

      const _network = await getActiveNetwork();
      console.log('network chainId', _network.chainId);
      // TODO - 
      const _tokens = await getTokenBalances(_wallet.address, chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap]);
      console.log(_tokens);
      //await wallet.provider.getNetwork();'
      const _provider = getDefaultProvider(_network.rpcUrl);
      //console.log(wallet._isSigner);
      const walletBalance = await wallet.connect(_provider).getBalance();

      const coinToken = {
        address: ethers.constants.AddressZero,
        amount: walletBalance,
        chainId: _network.chainId,
        name: _network.name,
        symbol: _network.symbol,
        type: 'coin',
      };
      if (!_tokens) {
        if (isComponentMounted) {
          if (_network.chainId === xucreToken.chainId) {
            setTokens([xucreToken, coinToken]);
            return;
          }
          setTokens([coinToken]);
          return;
        }
      }
      const convertedTokens = _tokens.map((token: { contractAddress: string; tokenBalance: any; }) => {
        const tokenMetadata = tokenMetadataMap[ethers.utils.getAddress(token.contractAddress) as keyof typeof tokenMetadataMap];

        return {
          //@ts-ignore
          name: tokenMetadata?.name,
          amount: BigNumber.from(token.tokenBalance),
          chainId: _network.chainId,
          address: ethers.utils.getAddress(token.contractAddress),
          type: 'token',
          //@ts-ignore
          logo: tokenMetadata?.logo,
          //@ts-ignore
          symbol: tokenMetadata?.symbol

        } as Token
      })
      const tokenList = [coinToken, ...convertedTokens];
      const hasXucre = tokenList.find((tok) => {
        return ethers.utils.getAddress(tok.address) === ethers.utils.getAddress(xucreToken.address) && tok.chainId === xucreToken.chainId
      });
      if (!!hasXucre) {
        if (isComponentMounted && tokenList) {
          setTokens(tokenList);
          return;
        }
      } else {
        if (isComponentMounted && tokenList) {
          if (network.chainId === xucreToken.chainId) {
            setTokens([xucreToken, coinToken, ...tokenList]);
            return;
          }
          setTokens([...tokenList as Token[]]);
          return;
        }
      }
    } catch (err) {
      console.log('fails when wallet is empty', err);
    }

  }

  const syncTransactions = async () => {
    const _transactions = await getWalletTransactions(_wallet.address, chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap]);

    if (_transactions && _transactions.data.items) {
      setTransactions(_transactions.data.items as readonly CovalentTransaction[]);
    }
  }

  const clearTransactions = () => {
    const runAsync = async () => {
      //await storeTransactions([] as readonly CovalentTransaction[]);
      await syncTransactions();
      setLoading(false);
    }
    setLoading(true);
    runAsync();
  }

  useEffect(() => {
    if (_wallet.name === '' && _walletList.length === 0) {
      navigation.navigate('SelectWallet');
    } else if (network && network.rpcUrl.length) {
      const _provider = getDefaultProvider(network.rpcUrl);
      if (_wallet.name === '') {
        setWallet(new WalletInternal(_walletList[0].wallet).connect(_provider));
      } else {
        setWallet(new WalletInternal(_wallet.wallet).connect(_provider));
      }

      setTimeout(() => {
        if (tokens.length === 0) {
          syncTokens();
        }
      }, 1000)
    }
  }, [_wallet, _walletList, network]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //setTokens([]);
    //setTransactions([]);
    //await refreshNetwork();
    setTimeout(async () => {
      await syncTokens();
      //await syncTransactions();
      setRefreshing(false);
    }, 500)
  }, []);

  const addToken = () => {
    navigation.navigate('AddToken');
  }

  const receiveFunds = () => {
    navigation.navigate('QRWallet');
  }

  const sendFunds = () => {
    navigation.navigate('SendToken');
  }

  const swapTokens = () => {
    navigation.navigate('SwapToken');
  }

  const openNft = () => {
    navigation.navigate('NFT');
  }

  const buyTokens = () => {
    navigation.navigate('BuyToken');
  }

  const connectWallet = () => {
    navigation.navigate('ConnectionManagement');
  }


  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  useEffect(() => {
    if (isFocused && wallet.address) {
      onRefresh();
    }
  }, [isFocused])

  const handleTabChange = (newTab: React.SetStateAction<string>) => {
    setCurrentTab(newTab);
  }

  const middleButtons = [
    {
      action: sendFunds,
      icon: "arrow-right-alt",
      text: buttonSend,
    },
    {
      action: receiveFunds,
      icon: "arrow-downward",
      text: buttonReceive,
    },
    {
      action: buyTokens,
      icon: "monetization-on",
      text: buttonBuy,
    },
    {
      action: connectWallet,
      icon: "qr-code-2",
      text: buttonConnect,
    },
  ];

  return (
    <DashboardLayout title={_wallet.name}>
      {network && network.rpcUrl === '' &&
        <Center
          _light={{ backgroundColor: 'white' }}
          _dark={{ backgroundColor: 'black' }}
          height={'100%'}
          justifyContent={'center'}
          safeAreaBottom
        >
          <Center bg={colorMode === 'dark' ? "primary.400" : "tertiary.500"} _text={{
            color: "white",
            fontWeight: "bold"
          }} height={200} width={{
            base: 200,
            lg: 250
          }}>
            <Text fontSize="md" _light={{ color: 'lightText' }} _dark={{ color: 'darkText' }} bold={true}>{translations[language as keyof typeof translations].ViewWallet.no_network_error}</Text>
          </Center>
        </Center>
      }
      {network && network.rpcUrl !== '' &&
        <Box
          _light={{ backgroundColor: 'white' }}
          _dark={{ backgroundColor: 'black' }}
          height={'100%'}
          safeAreaBottom
        >

          {
            <TotalBalance navigate={navigation.navigate} />
          }
          <HStack space="2" alignItems="center" justifyContent={'space-around'} marginTop={0} marginLeft={2} marginRight={2}>
            {
              middleButtons.map((btn, i) => {
                return (
                  <Button
                    key={'middleButtons' + i}
                    variant="solid"
                    backgroundColor={'gray.700'}
                    _stack={{
                      flexDirection: 'column'
                    }}
                    flex={.25}
                    startIcon={
                      <Icon
                        as={MaterialIcons}
                        name={btn.icon}
                        color={'white'}
                        size={7}
                      />
                    }
                    _text={{
                      color: 'white'
                    }}
                    paddingY={4}
                    paddingX={3}
                    borderRadius={10}
                    onPress={btn.action}
                  >
                    <Text color={'white'} fontSize={12}>{btn.text}</Text>
                  </Button>
                )
              })
            }

          </HStack>
          <VStack space="5" px={2} mb={10}>
            {/*currentTab == translations[language as keyof typeof translations].ViewWallet.tab_list[0] && wallet.address !== '' &&*/
              <Box m={6} >
                {/*<Button onPress={addToken} my={0} width={'full'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language as keyof typeof translations].ViewWallet.new_button}</Text></Button>*/}
                <FlatList data={tokens} refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colorMode === 'dark' ? Color.white : Color.darkgray_200}
                  />
                } renderItem={
                  ({ item, index }) => <TokenItem key={item.name + index} token={item} navigation={navigation} refreshList={onRefresh} />
                }
                  keyExtractor={item => item.name}
                />
              </Box>
            }
            {/*currentTab == translations[language as keyof typeof translations].ViewWallet.tab_list[1] && wallet.address !== '' &&
              <TokenBalancesListView address={wallet.address} />*/
            }
          </VStack>

          {false && currentTab == translations[language as keyof typeof translations].ViewWallet.tab_list[1] && transactions.length > 0 &&
            <Button onPress={clearTransactions} mt={4} width={'full'} position={'absolute'} bottom={0} isLoading={loading}><Text>{translations[language as keyof typeof translations].ViewWallet.clear_button}</Text></Button>
          }
          <MobileFooter navigation={navigation}></MobileFooter>
        </Box>
      }


    </DashboardLayout>
  )
}