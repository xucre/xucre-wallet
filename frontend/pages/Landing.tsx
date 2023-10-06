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
import { hasSignedPrivacyPolicy } from '../store/setting';

export default function LandingPage({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [languageDefault, setLanguageDefault] = useState(false);
  const [_wallet, ] = useRecoilState(activeWallet);
  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  const [hasSigned, setHasSigned] = useState(false);
  const {
    colorMode
  } = useColorMode();
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [loading, setLoading] = useState(true);

  const toWalletSelect = () => {
    if (route.name === 'Home') {
      if (languageDefault) {
        navigation.navigate('Language');  
      } else if (!hasSigned) {
        navigation.navigate('PrivacyPolicy'); 
      } else if (_wallet.name !== '') {
        navigation.navigate('ViewWallet');  
      } else {
        navigation.navigate('SelectWallet');
      }
    }
    
  }

  //Loading Fonts
  useEffect(() => {
    const callAsync = async () => {
      const _language = await getLanguage();
      const _hasSigned = await hasSignedPrivacyPolicy();
      if (isComponentMounted) {
        setFontsLoaded(true);

        setHasSigned(_hasSigned);
        if (_language) {
          setLanguageState(_language);
        } else {
          setLanguageState('en');
          setLanguageDefault(true);
        }

        setLoading(false);
      }   
    }
    if (isComponentMounted) {
      callAsync();
    }

    return () => {
      setIsComponentMounted(false);
    }
  }, [])

  
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
        _light={{ bg: '#1B1E3F' }}
        _dark={{ bg: '#D4E815' }}
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        _dark={{ bg: '#D4E815' }}
        _light={{ bg: '#1B1E3F' }}
      >
        <Stack
          w="100%"
          maxW={{ md: '1016' }}
          flex={{ base: '1', md: undefined }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box         
            _light={{ backgroundColor: '#1B1E3F' }}
            _dark={{ backgroundColor: '#D4E815' }}
            height={'100%'}
          >
            <VStack 
              justifyContent="space-between"
              
              px="10"
              alignSelf="center"
              position='relative'        
              top={'40%'}
              _light={{ backgroundColor: '#1B1E3F' }}
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
                      source={require('../assets/images/icon-white.png')}
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
              _light={{ backgroundColor: '#1B1E3F' }}
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
