/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet } from 'ethers';
import { v4 } from "uuid";
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
import { Asset } from 'expo-asset';
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
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import { writeAsStringAsync, readAsStringAsync, makeDirectoryAsync, readDirectoryAsync, bundleDirectory, documentDirectory, StorageAccessFramework, FileSystemRequestDirectoryPermissionsResult } from "expo-file-system"

import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeNetwork, activeWallet, AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { WalletInternal } from "../../store/wallet";
import { truncateString } from '../../service/utility';
import SetPassword from "../../components/SetPassword";
import { Color } from "../../../GlobalStyles";
import { googleLogoUrls } from "../../service/constants";
import { SvgUri } from "react-native-svg";
import { encryptPK, getKeyLocation, storeKeyLocation } from "../../store/setting";
import walletTemplate from '../../assets/templates/exportWallet'
import ContainedButton from "../../components/ui/ContainedButton";
import { useMixpanel } from "../../Analytics";


export default function ExportWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const address = route.params?.address;
  const mixpanel = useMixpanel();
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
  const [folderSelected, setFolderSelected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runAsyncAndroid = async () => {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        buttonPositive: 'Accepted',
        message: 'This app would like to access files.',
        title: 'Files',
      })
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        if (isMounted) setHasFileAccess(true);
      } else {
        if (isMounted) setHasFileAccess(false);
      }
    }
    if (Platform.OS === 'android' && Platform.Version < 33) {
      runAsyncAndroid()
    } else if (Platform.OS === 'android') {
      //runAsyncAndroid();
    } else if (Platform.OS === 'ios') {
      setFolderSelected(true);
    }
    mixpanel.track("view_page", { "page": "Export Wallet" });

    return () => { isMounted = false }
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

  const selectFolder = async () => {
    if (Platform.OS === 'android') {
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
      setFolderSelected(true);
    } else {
      const keyLocation = await getKeyLocation();
      setFolderLocation(keyLocation);

      setFolderSelected(true);
    }
  }

  const exportWallet = async () => {
    //const result = await readDirectoryAsync(documentDirectory as string);

    try {
      setGeneratingPass(true)
      const pk = await encryptPK(wallet.privateKey);
      if (pk) {
        const uri = folderLocation.granted ? folderLocation.directoryUri : documentDirectory;
        if (Platform.OS === 'ios') {
          const fileUrl = `${uri}${walletMetadata.address}`;
          const file = await writeAsStringAsync(fileUrl, pk);
          const list = await readDirectoryAsync(`${uri}`);
          const result = await shareAsync(fileUrl, { mimeType: 'text/plain' })
        } else if (Platform.OS === 'android') {
          const file = await StorageAccessFramework.createFileAsync(`${uri}`, `${walletMetadata.address}`, 'text/plain');
          const result2 = await StorageAccessFramework.writeAsStringAsync(`${file}`, pk);
        }
        setGeneratingPass(false);
        mixpanel.track("core_action", { "page": "Export Wallet", "action": "Wallet Exported", "wallet": walletMetadata.address });
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
                    {!folderSelected ?
                      <ContainedButton onPress={selectFolder}
                        buttonText={translations[language as keyof typeof translations].ExportWallet.folder_button}
                        width={'full'}
                      /> :
                      <ContainedButton onPress={exportWallet} isLoading={generatingPass}
                        buttonText={translations[language as keyof typeof translations].ExportWallet.button}
                        isLoadingText={translations[language as keyof typeof translations].ExportWallet.button_loading}
                        width={'full'}
                      />
                    }

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