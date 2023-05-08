/* eslint-disable react-native/no-inline-styles */
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';
import {Box, Center, Hidden, HStack, Image, Pressable, Stack, StatusBar, Text, useColorMode, VStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import { Dimensions,  TouchableWithoutFeedback } from 'react-native';
import Theme, {createStyle} from 'react-native-theming';
import { useRecoilState } from 'recoil';

import GuestLayout from '../layouts/GuestLayout';
import { activeWallet } from '../service/state';
import { language as stateLanguage } from "../service/state";
import { getLanguage, storeLanguage } from "../store/language";

export default function LandingPage({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [languageDefault, setLanguageDefault] = useState(false);
  const [_wallet, ] = useRecoilState(activeWallet);
  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  const {
    colorMode
  } = useColorMode();
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  const toWalletSelect = () => {
    console.log('languageDefault',languageDefault)
    if (languageDefault) {
      navigation.navigate('Language');  
    } else if (_wallet.name !== '') {
      navigation.navigate('ViewWallet');  
    } else {
      navigation.navigate('SelectWallet');
    }
  }

  //Loading Fonts
  useEffect(() => {
    const callAsync = async () => {
      await Font.loadAsync({
        Montserrat_400Regular,
        Montserrat_700Bold
      });
      const _language = await getLanguage();
      console.log('_language',_language);
      if (isComponentMounted) {
        setFontsLoaded(true);

        if (_language) {
          setLanguageState(_language);
        } else {
          setLanguageState('en');
          setLanguageDefault(true);
        }
      }     
    }
    if (isComponentMounted) {
      callAsync();
    }

    return () => {
      setIsComponentMounted(false);
    }
  }, [])

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        toWalletSelect();
      }, 4000)
    }
  }, [fontsLoaded, languageDefault])

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      {
        /*<StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colorMode === 'light' ? 'dark-content' : 'light-content'}
        />*/
      }
      <Box
        _light={{ bg: '#D4E815' }}
        _dark={{ bg: '#D4E815' }}
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        _dark={{ bg: '#D4E815' }}
        _light={{ bg: '#D4E815' }}
      >
        <Stack
          w="100%"
          maxW={{ md: '1016' }}
          flex={{ base: '1', md: undefined }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box         
            _light={{ backgroundColor: '#D4E815' }}
            _dark={{ backgroundColor: '#D4E815' }}
            height={'100%'}
          >
            <VStack 
              justifyContent="space-between"
              
              px="10"
              alignSelf="center"
              position='relative'        
              top={'40%'}
              _light={{ backgroundColor: '#D4E815' }}
              _dark={{ backgroundColor: '#D4E815' }}
            >
              
              <Pressable onPressIn={toWalletSelect}>
                <Hidden colorMode="light">
                  <Box >
                    <Image
                      style={{  height: 80, width: 80 }}
                      source={require('../assets/images/icon-black.png')}
                      alt="XucreWallet"
                    />
                  </Box>
                </Hidden>

                <Hidden colorMode="dark">
                  <Box >
                    <Image
                      style={{  height: 80, width: 80 }}
                      source={require('../assets/images/icon-black.png')}
                      alt="XucreWallet"
                    />
                  </Box>
                </Hidden>
              </Pressable>
            </VStack>     
            <VStack
              justifyContent="space-between"
              safeAreaBottom
              alignSelf="center"
              position='absolute'        
              bottom={'0%'}
              left={0}
              zIndex={-1000}
              _light={{ backgroundColor: '#D4E815' }}
              _dark={{ backgroundColor: '#D4E815' }}
            >
              <Image
                style={{  height: 325, width: 325, zIndex: -10000 }}
                source={require('../assets/images/landing-bottom.png')}
                alt="XucreWallet"
              />
            </VStack>
          </Box>
        </Stack>
      </Center>
    </>
      
  )
}
const customText = createStyle({
  montserrat: {
    fontFamily: 'Montserrat_400Regular'
  },
  montserratBold: {
    fontFamily: 'Montserrat_700Bold'
  },
});
