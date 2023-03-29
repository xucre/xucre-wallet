/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {StyleSheet} from 'react-native';
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
  View,
} from "native-base";
import React, {createRef, useEffect, useState} from "react";
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
    <DashboardLayout title={''}>
      <Box         
        _light={{ backgroundColor: '#000' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
        safeAreaBottom
      >
        <Center mt={10}>
          <Text  style={[styles.yourWallet, styles.walletTypo]} fontSize={'lg'} mt={5}>{translations[language].NewWallet.instructions}</Text>
          <Text style={[styles.createANew, styles.createFlexBox]} fontSize={'md'} mt={5}>{translations[language].NewWallet.about}</Text>
     
            <Button style={[styles.rectangleParent, styles.rectangleLayout]} onPress={createWallet} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations[language].NewWallet.create_button}</Text></Button>
        
            <Button style={[styles.rectangleGroup, styles.rectangleLayout, styles.buttonBorder]} width={'1/2'} py={3} colorScheme="primary" onPress={recoverWallet} ><Text color={"#fff"}>{translations[language].NewWallet.recover_button}</Text></Button>
        
        </Center>
      </Box>
    </DashboardLayout>
  )
}

const styles = StyleSheet.create({
  buttonBorder:{
    borderRadius: Border.br_sm,
    borderColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
  },
  createANew: {
    top: 230,
    fontSize: FontSize.size_base,
    lineHeight: 21,
    fontFamily: FontFamily.interRegular,
    color: Color.darkgray_100,
    textAlign: "center",
    letterSpacing: -0.2,
    left: 33,
    position: "absolute",
  },createFlexBox: {
    textAlign: "center",
    letterSpacing: -0.2,
    width: 330,
  },  yourWallet: {
    top: 180,
    left: 126,
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  },  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily.interSemibold,
    fontWeight: "600",
    position: "absolute",
  }, rectangleParent: {
    top: 330,
    borderRadius: Border.br_sm,
    backgroundColor: '#D4E815',
    fontFamily: FontFamily.interSemibold,
  },rectangleLayout: {
    height: 60,
    width: 330,
    left: 33,
    position: "absolute",
    borderColor: '#fff',
  }, rectangleGroup: {
    top: 410,
    borderColor: '#fff',
    backgroundColor: Color.gray_300,
  },

})