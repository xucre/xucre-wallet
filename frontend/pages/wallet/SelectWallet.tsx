/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  Menu,
  Pressable,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { v4 } from "uuid";

import { Color } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import GuestLayout from '../../layouts/GuestLayout';
import { activeWallet, AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { truncateStringStart } from "../../service/utility";
import { storeActiveWallet, WalletInternal, getWallets, storeWallet } from '../../store/wallet';
import { RefreshControl } from "react-native";
import DashboardLayout from "../../layouts/DashboardLayout";
import WalletItem from "../../components/wallet/WalletItem";
import ContainedButton from "../../components/ui/ContainedButton";
import { useMixpanel } from "../../Analytics";

export default function SelectWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const {
    colorMode
  } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [walletState, setWalletState] = useRecoilState(walletList);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const mixpanel = useMixpanel();

  useEffect(() => {
    mixpanel.track("view_page", { "page": "Select Wallet" });
  }, [])

  const createWallet = () => {
    navigation.navigate('NewWallet');
  }

  const viewWallet = () => {
    navigation.navigate('ViewWallet');
  }

  const exportWallet = (address: string) => {
    navigation.navigate("ExportWallet", { address });
  }

  return (
    <DashboardLayout title="">
      <Box
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        height={'100%'}
      >
        <VStack marginBottom={'10%'} marginY={4} justifyContent={'space-between'}>
          <FlatList data={walletState}
            renderItem={
              ({ item, index }) => {
                return (
                  <Box key={v4()} px={4} py={1}>
                    <WalletItem metadata={item} setActiveWallet={setActiveWallet} storeActiveWallet={storeActiveWallet} exportWallet={exportWallet} viewWallet={viewWallet} />
                    {(index + 1) !== walletState.length &&
                      <Divider orientation={'horizontal'} mt={4} _light={{
                        bg: "muted.800"
                      }} _dark={{
                        bg: "muted.300"
                      }} />
                    }

                  </Box>
                )
              }
            }
          />
        </VStack>
        <Box
          safeAreaBottom
          alignSelf="center"
          position='absolute'
          bottom={'2%'}
          left={0}
          width={'full'}
        >
          <ContainedButton width={''} onPress={createWallet} style={{ marginLeft: 10, marginRight: 10 }} buttonText={translations[language as keyof typeof translations].SelectWallet.new_button} />
        </Box>
      </Box>
    </DashboardLayout>
  )
}