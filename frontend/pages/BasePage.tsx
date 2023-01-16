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
import { language as stateLanguage } from "../service/state";

export default function BasePage({navigation, route}) {
  const [language, ] = useRecoilState(stateLanguage);
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      // do something
    }

    runAsync();
  }, [])
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>
      
    </ScrollView>
  );
}