/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
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
  Menu,
  MoonIcon,
  Pressable,
  Select,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import {StyleSheet} from 'react-native';
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { getLanguage, storeLanguage } from "../store/language";
import { hasSignedPrivacyPolicy } from "../store/setting";

export default function LanguagePage ({navigation}) {
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [languageVal, setLanguageVal] = useState('');
  const [hasSigned, setHasSigned] = useState(false);
  useEffect(() => {
    const runAsync = async () => {
      const _hasSigned = await hasSignedPrivacyPolicy();
      setHasSigned(_hasSigned);
    }
    runAsync();
    
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  const {
    colorMode
  } = useColorMode();

  const [languageState, setLanguageState] = useRecoilState(stateLanguage);

  const updateLanguage = async (_language) => {
    await storeLanguage(_language);
    if (hasSigned) {
      navigation.navigate('SelectWallet');
    } else {
      navigation.navigate('PrivacyPolicy');
    }
    
  }

  const setLanguage = (val) => {
    setLanguageState(val);
    setLanguageVal(val);
    updateLanguage(val);
  }

  return (
    <>
        <Text color={colorMode === 'dark' ? Color.white : Color.black} style={[styles.yourWallet, styles.walletTypo]} fontSize={'lg'} mt={5}>{translations[languageState].LanguagePage.title_language}</Text>
          
        <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
              <Button style={[styles.rectangleParent, styles.rectangleSibling]} onPress={() => {setLanguage('es')}} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations['es'].LanguagePage.select_language || 'select your language : es'}</Text></Button>
              <Button style={[styles.rectangleParent, styles.rectangleSibling]} onPress={() => {setLanguage('pt')}} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations['pt'].LanguagePage.select_language || 'select your language : pt'}</Text></Button>
              <Button style={[styles.rectangleParent, styles.rectangleSibling]} onPress={() => {setLanguage('qu')}} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations['qu'].LanguagePage.select_language || 'select your language : qu'}</Text></Button>
              <Button style={[styles.rectangleParent, styles.rectangleSibling]} onPress={() => {setLanguage('nah')}} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations['nah'].LanguagePage.select_language || 'select your language : nah'}</Text></Button>
              <Button style={[styles.rectangleParent, styles.rectangleSibling]} onPress={() => {setLanguage('en')}} width={'1/2'} py={3}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations['en'].LanguagePage.select_language || 'select your language : en'}</Text></Button>                
        </Box>
      
    </>
    
  );
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
    top: 250,
  },
  rectangleSibling: {
    margin: 10
  },
  walletTypo: {
    fontFamily: FontFamily.inter,
    fontWeight: "600",
    //position: "absolute",
  },
  yourWallet: {
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
    top: 180,
  }

})