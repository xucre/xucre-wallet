import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import {
  AlertDialog,
  ArrowBackIcon,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { activeNetwork, activeWallet, selectedNetwork, language as stateLanguage, } from "../service/state";


export default function NetworkIcon({navigation, route}) {
  const [language, ] = useRecoilState(stateLanguage);
  const [network, ] = useRecoilState(selectedNetwork);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      //
    }
    //console.log('NetworkIcon',_activeNetwork, network);
    runAsync();
  }, [_activeNetwork, network])
  return (
    <></>
  );
}