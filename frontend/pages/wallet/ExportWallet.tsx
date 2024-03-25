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
import { Linking, PermissionsAndroid, Platform, RefreshControl } from "react-native";
import { Area, Chart, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart';
import { useRecoilState } from "recoil";
import { writeAsStringAsync, readAsStringAsync, makeDirectoryAsync, readDirectoryAsync, documentDirectory, StorageAccessFramework, FileSystemRequestDirectoryPermissionsResult } from "expo-file-system"

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
import { encryptPK, getKeyLocation, storeKeyLocation } from "../../store/setting";
import walletTemplate from '../../assets/templates/exportWallet'
import ContainedButton from "../../components/ui/ContainedButton";


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
  const [hasFileAccess, setHasFileAccess] = useState(true);
  const [folderLocation, setFolderLocation] = useState({} as FileSystemRequestDirectoryPermissionsResult)

  useEffect(() => {
    const runAsyncAndroid = async () => {
      const keyLocation = await getKeyLocation();
      if (!keyLocation.granted) {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          setFolderLocation(permissions);
          await storeKeyLocation(permissions);
        }
      } else {
        setFolderLocation(keyLocation);
      }
    }
    if (Platform.OS === 'android' && Platform.Version < 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        buttonPositive: 'Accepted',
        message: 'This app would like to access files.',
        title: 'Files',
      }).then((result) => {
        console.log('PermissionsAndroid', result as string);
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setHasFileAccess(true);
        } else {
          setHasFileAccess(false);
        }
      })
    } else if (Platform.OS === 'android') {
      runAsyncAndroid();
    }

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
    //const result = await readDirectoryAsync(documentDirectory as string);

    try {
      setGeneratingPass(true)
      const pk = await encryptPK(wallet.privateKey);
      if (pk) {
        const uri = folderLocation.granted ? folderLocation.directoryUri : '';
        const file = await StorageAccessFramework.createFileAsync(`${uri}`, `${walletMetadata.name.split(' ').join('_')}`, 'text/html');
        //console.log('file created', file);
        const result2 = await StorageAccessFramework.writeAsStringAsync(`${file}`, walletTemplate(walletMetadata.name, pk));
        //const result2 = await writeAsStringAsync(documentDirectory + 'wallet', 'test');
        //console.log('data written', result2);

        setGeneratingPass(false);
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
                    <ContainedButton onPress={exportWallet} isLoading={generatingPass}
                      buttonText={translations[language as keyof typeof translations].ExportWallet.button}
                      isLoadingText={translations[language as keyof typeof translations].ExportWallet.button_loading}
                      width={'full'}
                    />
                  </VStack>
                }

                <SetPassword setIsExisting={(_isExisting: boolean) => { setPasswordSet(_isExisting) }} />
                {!passwordSet &&
                  <Box></Box>
                }
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