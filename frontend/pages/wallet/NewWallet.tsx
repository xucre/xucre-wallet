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


export default function NewWallet ({navigation, route}) {
  const { colorMode } = useColorMode();

  const [language,] = useRecoilState(stateLanguage);
  
  const createWallet = () => {
    navigation.navigate('CreateWallet');
  }

  const recoverWallet = () => {
  navigation.navigate('RecoverWallet');
}

  return (
    <DashboardLayout title={''}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
        safeAreaBottom
      >
        <Center mt={10}>
          <Text fontSize={'lg'} mt={5}>{translations[language].NewWallet.instructions}</Text>
          <Button.Group isAttached colorScheme="muted" size="full" mt={5}>
            <Button onPress={createWallet} width={'1/2'} py={3}><Text>{translations[language].NewWallet.create_button}</Text></Button>
            <Button width={'1/2'} py={3} colorScheme="primary" onPress={recoverWallet} ><Text>{translations[language].NewWallet.recover_button}</Text></Button>
          </Button.Group>
        </Center>
      </Box>
    </DashboardLayout>
  )
}