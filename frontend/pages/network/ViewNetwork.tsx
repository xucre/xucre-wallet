import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
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
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeWallet, selectedNetwork, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";

export default function ViewNetwork ({navigation, route}) {
  const [language,] = useRecoilState(stateLanguage);
  const [network, ] = useRecoilState(selectedNetwork);

  useEffect(() => {
    //
  }, [activeWallet]);

  return (
    <DashboardLayout title={network.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        <VStack space={4} px={2} py={4}>
          <Text fontSize={28}>{network.name}</Text>
          <Text fontSize={20}>Chain Id: {network.chainId}</Text>
          <Text fontSize={16}>Symbol: {network.symbol}</Text>
          <Text fontSize={16}>RPC Url: {truncateString(network.rpcUrl, 30)}</Text>
        </VStack>        
      </Box>
    </DashboardLayout>
  )
}