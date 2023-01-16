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
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { getLanguage, storeLanguage } from "../store/language";

export default function SelectLanguage () {
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [languageVal, setLanguageVal] = useState('');
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  const {
    colorMode
  } = useColorMode();

  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  useEffect(() => {
    const runAsync = async () => {
      const _language = await getLanguage();
      if (_language) {
        setLanguageState(_language);
        setLanguageVal(_language);
      } else {
        setLanguageState('en');
        setLanguageVal('en');
      }
      
    }
    runAsync();
  }, []);

  const updateLanguage = async (_language) => {
    await storeLanguage(_language);
  }

  const setLanguage = (val) => {
    setLanguageState(val);
    setLanguageVal(val);
    updateLanguage(val);
  }

  return (
    <>
      {languageVal !== '' && 
        <Menu w="190" trigger={triggerProps => {
          return <Pressable accessibilityLabel="options" {...triggerProps}>
              <MaterialIcons name="language" size={24} color={'gray'} />
            </Pressable>;
          }}>
            <Menu.Item onPress={() => {setLanguage('en')}}><Text>{translations[languageVal].SelectLanguage.en}</Text></Menu.Item>
            <Menu.Item onPress={() => {setLanguage('es')}}><Text>{translations[languageVal].SelectLanguage.es}</Text></Menu.Item>
            <Menu.Item onPress={() => {setLanguage('pt')}}><Text>{translations[languageVal].SelectLanguage.pt}</Text></Menu.Item>
            <Menu.Item onPress={() => {setLanguage('qu')}}><Text>{translations[languageVal].SelectLanguage.qu}</Text></Menu.Item>
            <Menu.Item onPress={() => {setLanguage('nah')}}><Text>{translations[languageVal].SelectLanguage.nah}</Text></Menu.Item>
        </Menu>    
      }
    </>
    
  );
}

