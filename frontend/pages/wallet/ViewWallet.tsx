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
import { getTokenItems, storeTokenItems } from "../../store/tokenItem";
import { getTokenBalances, getWalletTransactions, swapUrl } from "../../service/api";
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
import { Linking } from "react-native";
import { isSpam } from "../../store/spam";

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
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  const tabList = translations[language as keyof typeof translations].ViewWallet.tab_list;
  //Buttons

  const buttonSend = translations[language as keyof typeof translations].Buttons_Header.send;
  const buttonReceive = translations[language as keyof typeof translations].Buttons_Header.receive;
  const buttonBuy = translations[language as keyof typeof translations].Buttons_Header.buy;
  //const buttonNft = translations[language as keyof typeof translations].Buttons_Header.nft;
  const buttonConnect = translations[language as keyof typeof translations].Buttons_Header.connect;
  const buttonSwap = translations[language as keyof typeof translations].Buttons_Header.buttonswap;
  const buttonProfile = translations[language as keyof typeof translations].Buttons_Header.profile;
  const buttonRamp = translations[language as keyof typeof translations].Buttons_Header.ramp;

  const tokenMetadataMap = network.chainId === 1 ? ethTokens : network.chainId === 137 ? polygonTokens : {};

  const syncTokens = async () => {
    try {

      const _network = await getActiveNetwork();

      const _tokens = (await getTokenBalances(_wallet.address.toLowerCase(), chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap])).tokenBalances;

      //const _provider = getDefaultProvider(_network.rpcUrl);

      //const walletBalance = await wallet.connect(_provider).getBalance();

      const coinToken = {
        address: ethers.constants.AddressZero,
        //amount: walletBalance,
        chainId: _network.chainId,
        name: _network.name,
        symbol: _network.symbol || 'NA',
        type: 'coin',
        isNotSpammable: true
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
      } else {
        const tokenList = [..._tokens.map((token: { contractAddress: string; tokenBalance: any; }) => {
          const tokenMetadata = tokenMetadataMap[token.contractAddress.toLowerCase() as keyof typeof tokenMetadataMap];
          const _token = {
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
          } as Token
          return _token;
        }).values(), coinToken];
        const finalTokens = tokenList.sort((a, b) => {
          if (a.amount && b.amount) {
            return (a.amount.gt(b.amount)) ? -1 : 1
          } else if (a) {
            return -1;
          } else {
            return 1;
          }
        });
        setTokens(finalTokens);
        return;
      }
    } catch (err) {
    }

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

      setTimeout(async () => {
        /*const _tokens = await getTokenItems(_wallet.address, network.chainId);
        if (_tokens && _tokens.length > 0) {
          const finalTokens = [..._tokens.map((token) => {
            return {
              ...token,
              amount: BigNumber.from(token.amount?.hex || 0)
            } as Token;
          }).values()];

          setTokens(finalTokens);
        } else {
          syncTokens();
        }*/
        syncTokens();

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

  const rampWallet = () => {
    navigation.navigate('Ramp');
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

  const openProfile = () => {
    navigation.navigate('ProfileList');
  }

  const buyTokens = async () => {
    //navigation.navigate('SwapToken');
    const supported = await Linking.canOpenURL(swapUrl);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(swapUrl);
    }
  }

  const connectWallet = () => {
    navigation.navigate('ConnectionManagement');
  }

  useEffect(() => {
    if (isFocused && wallet.address) {
      //onRefresh();
    }
  }, [isFocused])

  useEffect(() => {
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      storeTokenItems(_wallet.address, _network.chainId, tokens);
    }
    if (tokens.length > 0) {
      runAsync();
    }
  }, [tokens])

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
      // action: openProfile,
      // icon: "person",
      // text: buttonProfile
    },
    {
      action: connectWallet,
      icon: "qr-code-2",
      text: buttonConnect,
    }/*,
    {
      action: rampWallet,
      icon: 'call-merge',
      text: buttonRamp
    }*/
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
                    flex={.20}
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
              <Box m={6} height={'2/3'}>
                {/*<Button onPress={addToken} my={0} width={'full'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language as keyof typeof translations].ViewWallet.new_button}</Text></Button>*/}
                <FlatList data={tokens} refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colorMode === 'dark' ? Color.white : Color.darkgray_200}
                  />
                } renderItem={
                  ({ item, index }) => <TokenItem key={item.address + index} token={item} navigation={navigation} refreshList={onRefresh} wallet={wallet} />
                }
                />
              </Box>
            }
            {/*currentTab == translations[language as keyof typeof translations].ViewWallet.tab_list[1] && wallet.address !== '' &&
              <TokenBalancesListView address={wallet.address} />*/
            }
          </VStack>

          { }
        </Box>
      }

      <MobileFooter navigation={navigation}></MobileFooter>
    </DashboardLayout>
  )
}