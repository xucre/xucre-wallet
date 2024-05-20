/* eslint-disable react-native/no-inline-styles */
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';
import { Box, Center, Hidden, HStack, Image, Pressable, Stack, StatusBar, Text, useColorMode, VStack } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRecoilState } from 'recoil';

import GuestLayout from '../layouts/GuestLayout';
import { activeWallet } from '../service/state';
import { language as stateLanguage } from "../service/state";
import { getLanguage, storeLanguage } from "../store/language";
import { hasSignedPrivacyPolicy } from '../store/setting';

export default function LandingPage({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [languageDefault, setLanguageDefault] = useState(false);
  const [_wallet,] = useRecoilState(activeWallet);
  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  const [hasSigned, setHasSigned] = useState(false);
  const {
    colorMode
  } = useColorMode();
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
    let isMounted = true;
    const callAsync = async () => {
      const _language = await getLanguage();
      const _hasSigned = await hasSignedPrivacyPolicy();
      if (isMounted) {
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

    callAsync();

    return () => {
      isMounted = false;
    }
  }, [])


  return (
    <>
      <Box
        bg='#D4E815'
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        bg='#D4E815'
      >
        <Stack
          flex={{ base: '1', md: undefined }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box
            backgroundColor={'#D4E815'}
            height={'100%'}
          >
            <VStack
              justifyContent="space-between"

              px="10"
              alignSelf="center"
              position='relative'
              top={'40%'}
              backgroundColor={'#D4E815'}
            >

              <Pressable onPressIn={toWalletSelect}>
                <Box >
                  <Image
                    style={{ height: 80, width: 80 }}
                    source={require('../assets/images/icon-black.png')}
                    alt="XucreWallet"
                  />
                </Box>
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
              backgroundColor={'#D4E815'}
            >
              {Dimensions.get('screen').height < 1000 && false &&
                <Image
                  style={{ height: Dimensions.get('window').height / 2, width: Dimensions.get('window').width, zIndex: -10000 }}
                  source={require('../assets/images/landing-bottom.png')}
                  alt="XucreWallet"
                />
              }

            </VStack>
          </Box>
        </Stack>
      </Center>
    </>

  )
}
