import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  ColorMode,
  Divider,
  Drawer,
  Hidden,
  HStack,
  IconButton,
  Icon as IconElement,
  Image,
  Input,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {createRef, useEffect, useState} from "react";
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeWallet, language as stateLanguage } from "../../service/state";


export default function QRWallet ({navigation, route}) {
  const { colorMode } = useColorMode();

  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    }
  }, [_wallet]);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  return (
    <DashboardLayout title={_wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
        safeAreaBottom
      >
        <Center mt={10}>
          <QRCode
            size={256}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ height: "auto", marginLeft: 'auto', marginRight: 'auto', maxWidth: "100%", width: "100%", }}
            value={_wallet.wallet.address}
            viewBox={`0 0 256 256`}
          />
          <Text variant={'lg'} mt={5}>{translations[language].QRWallet.instructions}</Text>
        </Center>
      </Box>
    </DashboardLayout>
  )
}