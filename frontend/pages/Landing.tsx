/* eslint-disable react-native/no-inline-styles */
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import {Box, Center, Hidden, HStack, Image, Pressable, Text, VStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import { Dimensions,  TouchableWithoutFeedback } from 'react-native';
import Theme, {createStyle} from 'react-native-theming';

import GuestLayout from '../layouts/GuestLayout';

//import * as SplashScreen from 'expo-splash-screen';
export default function LandingPage({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  const toWalletSelect = () => {
    //if (isComponentMounted) {

        //navigation.navigate('Channels', {artistId: null, type: 'all'})

        navigation.navigate('SelectWallet');
      
    //} 
  }

  //Loading Fonts
  useEffect(() => {
    const callAsync = async () => {
      await Font.loadAsync({
        Montserrat_400Regular,
        Montserrat_700Bold
      });
      if (isComponentMounted) {
        setFontsLoaded(true);
      }
    }
    if (isComponentMounted) {
      callAsync();
    }

    return () => {
      setIsComponentMounted(false);
    }
  }, [])

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GuestLayout>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        <VStack 
          justifyContent="space-between"
          safeAreaBottom
          safeAreaTop
          px="10"
          alignSelf="center"
          position='relative'        
          top={'60%'}
          _light={{ backgroundColor: 'white' }}
          _dark={{ backgroundColor: '#1b1e24' }}
        >
          
          <Pressable onPressIn={toWalletSelect}>
            <Hidden colorMode="light">
              <Box >
                <Image
                  style={{ height: 100, width: 170 }}
                  source={require('../assets/images/logo-long-white.png')}
                  alt="XucreWallet"
                />
              </Box>
            </Hidden>

            <Hidden colorMode="dark">
              <Box >
                <Image
                  style={{ height: 100, width: 170 }}
                  source={require('../assets/images/logo-long.png')}
                  alt="XucreWallet"
                />
              </Box>
            </Hidden>
          </Pressable>
        </VStack>     
      </Box>
    </GuestLayout>
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
