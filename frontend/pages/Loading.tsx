/* eslint-disable react-native/no-inline-styles */
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';
import { Box, Center, Hidden, HStack, Image, Pressable, Stack, StatusBar, Text, useColorMode, VStack } from 'native-base';
import React from 'react';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRecoilState } from 'recoil';

import GuestLayout from '../layouts/GuestLayout';
import { activeWallet } from '../service/state';

export default function LandingPage() {
  const [_wallet,] = useRecoilState(activeWallet);
  const toWalletSelect = () => {
  }

  return (
    <>
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
                      style={{ height: 80, width: 80 }}
                      source={require('../assets/images/icon-black.png')}
                      alt="XucreWallet"
                    />
                  </Box>
                </Hidden>

                <Hidden colorMode="dark">
                  <Box >
                    <Image
                      style={{ height: 80, width: 80 }}
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
