import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, Wallet } from 'ethers';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { useRecoilState } from "recoil";
//import { TokenBalancesListView } from "@covalenthq/goldrush-kit";


import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import TokenItem from '../../components/token/TokenItem';
import CovalentItem from "../../components/transaction/CovalentItem";
import TotalBalance from "../../components/wallet/TotalBalance";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletTransactions } from "../../service/api";
import { chainIdToNameMap, xucreToken } from "../../service/constants";
import { activeNetwork, activeWallet, networkList, language as stateLanguage, walletList, tokenList } from '../../service/state';
import { CovalentTransaction } from "../../service/transaction";
import { getTokenByChain } from '../../store/token';
import NftList from "../nft/NftList";
import { Token } from "../../service/token";
import { WalletInternal } from "../../store/wallet";
import { TouchableOpacity } from "react-native";
import { Color } from "../../../GlobalStyles";

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}: {
  tabName: string,
  currentTab: string,
  handleTabChange: Function
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'gray.700' : 'gray.700',
          }}
          _dark={{
            color: tabName === currentTab ? 'gray.100' : 'gray.100',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            marginBottom={-1}
            h="0.5"
          />
        )}
      </VStack>
    </Pressable>
  );
}

export default function ViewWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ViewWallet.tab_list[0]);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [network,] = useRecoilState(activeNetwork);
  const [holdings, setHoldings] = useState([] as Token[]);
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
  const buttonNft = translations[language as keyof typeof translations].Buttons_Header.nft;
  const buttonConnect = translations[language as keyof typeof translations].Buttons_Header.connect;

  const syncTokens = async () => {
    const _tokens = await getTokenByChain(network.chainId);
    const coinToken = {
      address: '',
      amount: BigNumber.from(0),
      chainId: network.chainId,
      name: network.symbol,
      type: 'coin',
    };
    if (!_tokens) {
      if (isComponentMounted) {
        if (network.chainId === xucreToken.chainId) {
          setHoldings([xucreToken, coinToken]);
          return;
        }
        setHoldings([coinToken]);
        return;
      }
    }
    const tokenList = [coinToken, ..._tokens as Token[]];
    const hasXucre = tokenList.find((tok) => {
      return tok.address === xucreToken.address && tok.chainId === xucreToken.chainId
    });
    if (!!hasXucre) {
      if (isComponentMounted && tokenList) {
        setHoldings(tokenList);
        return;
      }
    } else {
      if (isComponentMounted && tokenList) {
        if (network.chainId === xucreToken.chainId) {
          setHoldings([xucreToken, coinToken]);
          return;
        }
        setHoldings([...tokenList as Token[]]);
        return;
      }
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
    } else if (network) {
      if (_wallet.name === '') {
        setWallet(new WalletInternal(_walletList[0].wallet));
      } else {
        setWallet(new WalletInternal(_wallet.wallet));
      }

    }
  }, [_wallet, _walletList, network]);

  useEffect(() => {
    setTimeout(() => {
      if (holdings.length === 0) {
        syncTokens();
      }
      if (transactions.length === 0) {
        syncTransactions();
      }
    }, 1000)
  }, [])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setHoldings([]);
    setTransactions([]);

    setTimeout(async () => {
      await syncTokens();
      //await syncTransactions();
      setRefreshing(false);
    }, 100)
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
      action: buyTokens,
      icon: "monetization-on",
      text: buttonBuy,
    },
    {
      action: receiveFunds,
      icon: "arrow-downward",
      text: buttonReceive,
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
                <Button onPress={addToken} my={0} width={'full'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language as keyof typeof translations].ViewWallet.new_button}</Text></Button>
                <FlatList data={holdings} refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
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