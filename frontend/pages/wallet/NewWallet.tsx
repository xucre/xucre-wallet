/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
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
  View,
  VStack,
} from "native-base";
import React, {createRef, useEffect, useState} from "react";
import {StyleSheet} from 'react-native';
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
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
    
    <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
    
          <Text  style={[styles.yourWallet, styles.walletTypo]} fontSize={'lg'} mt={5}>{translations[language].NewWallet.instructions}</Text>
          <Text style={[styles.createANew, styles.createFlexBox]} fontSize={'md'} mt={5}>{translations[language].NewWallet.about}</Text>
     
            <Button style={[styles.rectangleParent, styles.rectangleLayout]} onPress={createWallet} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations[language].NewWallet.create_button}</Text></Button>
        
            <Button style={[styles.rectangleGroup, styles.rectangleLayout, styles.buttonBorder]} width={'1/2'} py={3} colorScheme="primary" onPress={recoverWallet} ><Text color={"#fff"}>{translations[language].NewWallet.recover_button}</Text></Button>
  
              
      </Box>
  )
}

const styles = StyleSheet.create({
  buttonBorder:{
    borderColor: "#fff",
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
  },
  createANew: {
    color: Color.darkgray_100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
    position: "absolute",
    textAlign: "center",
    top: 230,
  },
  createFlexBox: {
    letterSpacing: -0.2,
    textAlign: "center",
    width: 330,
  },
  rectangleGroup: {
    backgroundColor: Color.gray_300,
    borderColor: '#fff',
    top: 410,
  },
  rectangleLayout: {
    borderColor: '#fff',
    height: 60,
    position: "absolute",
    width: 330,
  },
  rectangleParent: {
    backgroundColor: '#D4E815',
    borderRadius: Border.br_sm,
    fontFamily: FontFamily.inter,
    top: 330,
  },
  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    fontWeight: "600",
    position: "absolute",
  },
  yourWallet: {
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
    top: 180,
  }

})