/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet } from 'ethers';
import { v4 } from "uuid";
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Image,
  Menu,
  Pressable,
  ScrollView,
  Stack,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Linking, RefreshControl } from "react-native";
import { Area, Chart, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart';
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import SummaryItem from "../../components/token/SummaryItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { createGoogleWalletPass, getWalletHistory } from "../../service/api";
import { chainIdToNameMap, chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, ItemsWithOpenQuote, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { processJsonData, truncateString } from '../../service/utility';
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import TransactionFeed from "../../components/transaction/TransactionFeed";
import { useIsFocused } from "@react-navigation/native";
import { getActiveNetwork } from "../../store/network";
import SetPassword from "../../components/SetPassword";
import { Color } from "../../../GlobalStyles";
import { googleLogoUrls } from "../../service/constants";
import { SvgUri } from "react-native-svg";
import { encryptPK } from "../../store/setting";


export default function ExportWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const address = route.params?.address;
  const [loading, setLoading] = useState(true);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  //const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [walletState, setWalletState] = useRecoilState(walletList);
  const [wallet, setWallet] = useState({} as Wallet);
  const [walletMetadata, setWalletMetadata] = useState({} as AppWallet)
  const [passwordSet, setPasswordSet] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [generatingPass, setGeneratingPass] = useState(false);

  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  useEffect(() => {
    if (address) {
      const _wallet = walletState.find((w) => w.address === address);
      if (_wallet) {
        setWallet(new WalletInternal(_wallet.wallet))
        setWalletMetadata(_wallet)
        setLoading(false);
      }
    }
  }, [address]);

  const isValidWallet = wallet && wallet.address;

  const exportWallet = async () => {
    try {
      setGeneratingPass(true)
      const pk = await encryptPK(wallet.privateKey);
      if (pk) {
        const { pass } = await createGoogleWalletPass({ address: wallet.address, pk, email: v4() });
        const supported = await Linking.canOpenURL(pass);
        if (supported) {
          setGeneratingPass(false);
          await Linking.openURL(pass);
        }
      }
      setGeneratingPass(false);
    } catch (err) {
      setGeneratingPass(false);
    }

  }

  return (
    <DashboardLayout title={''}>
      <Box
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'black' }}
        height={'full'}
        overflow={'auto'}
        safeAreaBottom
      >
        {isValidWallet ?
          <>
            {!loading &&
              <Stack direction={'column'} justifyContent={'space-between'} height={'full'}>
                <Box></Box>
                {passwordSet &&
                  <VStack space={2} alignItems="center">
                    <Heading
                      style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
                      py={2}
                    >{walletMetadata.name}</Heading>
                    <Text fontSize="xl">{truncateString(walletMetadata.address, 12, true)}</Text>
                    <Text
                      style={{
                        color: colorMode === 'dark' ? Color.white : Color.black,
                        textAlign: "center",
                      }}
                      fontSize={"md"}
                      py={5}
                    >
                      {translations[language as keyof typeof translations].ExportWallet.instructions}
                    </Text>
                    <Button variant={'unstyled'} onPress={exportWallet} isLoading={generatingPass}
                      _loading={{
                        _text: {
                          color: colorMode === 'dark' ? Color.white : Color.black
                        }
                      }} _spinner={{
                        color: colorMode === 'dark' ? Color.white : Color.black
                      }} isLoadingText={translations[language as keyof typeof translations].ExportWallet.button_loading} >
                      {language === 'pt' &&
                        <SvgUri
                          height={40}
                          uri={googleLogoUrls.br}
                          accessibilityLabel="Adicionar à Carteira virtual do Google"
                        />
                      }
                      {language === 'en' &&
                        <SvgUri
                          height={40}
                          uri={googleLogoUrls.en}
                          accessibilityLabel="Add to Google Wallet"
                        />
                      }
                      {language !== 'en' && language !== 'pt' &&
                        <SvgUri
                          height={40}
                          uri={googleLogoUrls.es}
                          accessibilityLabel="Añadir a Google Wallet"
                        />
                      }
                    </Button>


                  </VStack>
                }

                <SetPassword setIsExisting={(_isExisting: boolean) => { setPasswordSet(_isExisting) }} />
              </Stack>
            }
          </>
          :
          <Text>{translations[language as keyof typeof translations].ExportWallet.invalid_wallet}</Text>
        }

      </Box>
    </DashboardLayout>
  )
}