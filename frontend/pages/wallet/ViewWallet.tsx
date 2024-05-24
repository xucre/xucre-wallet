import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from 'ethers';
import {
  Box,
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
import MobileFooter from "../../components/ui/Footer";
import TokenItem from '../../components/token/TokenItem';
import TotalBalance from "../../components/wallet/TotalBalance";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getTokenItems, storeTokenItems } from "../../store/tokenItem";
import { storeWallet } from "../../store/wallet";
import { activeNetwork, activeWallet, language as stateLanguage, walletList } from '../../service/state';

import { WalletInternal } from "../../store/wallet";
import { getActiveNetwork } from "../../store/network";
import { Color } from "../../../GlobalStyles";
import { useIsFocused } from '@react-navigation/native';
import { Linking } from "react-native";
import SquareButton from "../../components/ui/SquareButton";
import useTokens from "../../hooks/useTokens";
import { useMixpanel } from "../../hooks/useMixpanel";

export default function ViewWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const mixpanel = useMixpanel();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ViewWallet.tab_list[0]);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const network = useRecoilValue(activeNetwork);
  //const [tokens, setTokens] = useState([] as Token[]);
  const { tokens, tokenPrices, reset } = useTokens();
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
    }
  }, [_wallet, _walletList]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(async () => {
      await reset(true);
      setRefreshing(false);
    }, 500)
  }, []);

  const addToken = () => {
    navigation.navigate('AddToken');
  }

  const rampWallet = async () => {
    //navigation.navigate('Ramp');
    const hostApiKey = 'u3tz8szbe6xef5o647ufwtqd65235wfttw8aq8ob';
    const hostAppName = 'Xucre Wallet';
    const hostLogoUrl = 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre_logo.png';
    await Linking.openURL(`https://app.demo.ramp.network?hostApiKey=${hostApiKey}&hostAppName=${hostAppName}&hostLogoUrl=${hostLogoUrl}&userAddress=${_wallet.address}`);
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

  const openExtensions = () => {
    navigation.navigate('Extensions');
  }

  const buyTokens = async () => {
    navigation.navigate('BuyToken');
  }

  const connectWallet = () => {
    navigation.navigate('ConnectionManagement');
  }

  useEffect(() => {
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      if (_network) storeTokenItems(_wallet.address, _network.chainId, tokens);
    }
    if (_wallet && tokens && tokens.length > 0) {
      runAsync();
    }
  }, [tokens])

  useEffect(() => {
    const runAsync = async () => {
      await mixpanel.track("view_page", { "page": "View Wallet" });
    }
    runAsync();
  }, [])

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
      action: openExtensions,
      icon: "apps",
      text: 'Apps'//buttonBuy,
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
                  <SquareButton
                    key={'middleButtons' + i}
                    icon={btn.icon}
                    buttonText={btn.text}
                    onPress={btn.action}
                  />
                )
              })
            }

          </HStack>
          <VStack space="5" px={2} mb={10}>
            {/*currentTab == translations[language as keyof typeof translations].ViewWallet.tab_list[0] && wallet.address !== '' &&*/
              <Box m={6} height={'2/3'}>
                <FlatList data={tokens} refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colorMode === 'dark' ? Color.white : Color.darkgray_200}
                  />
                } renderItem={
                  ({ item, index }) => <TokenItem key={item.address + index} token={item} navigation={navigation} refreshList={onRefresh} wallet={wallet} price={tokenPrices} />
                }
                />
              </Box>
            }
          </VStack>

          { }
        </Box>
      }

      <MobileFooter navigation={navigation}></MobileFooter>
    </DashboardLayout>
  )
}