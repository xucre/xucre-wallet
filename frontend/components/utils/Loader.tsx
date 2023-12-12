
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import notifee, { EventType } from '@notifee/react-native';
import * as Font from 'expo-font';
import { Box, Center, Hidden, HStack, Image, Pressable, Stack, StatusBar, Text, useColorMode, VStack } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRecoilState } from 'recoil';

import { EIP155_SIGNING_METHODS } from '../../data/EIP1155Data';
import GuestLayout from '../../layouts/GuestLayout';
import { navigate, navigationRef } from '../../service/RootNavigation';
import { activeNetwork, activeWallet } from '../../service/state';
import { language as stateLanguage } from "../../service/state";
import { getLanguage, storeLanguage } from "../../store/language";
import { deleteNotification, getNotification, getTheme, storeTheme } from '../../store/setting';
import { hasSignedPrivacyPolicy } from '../../store/setting';
import { getActiveNetwork } from '../../store/network';


export default function Loader() {
  const appState = useRef(AppState.currentState);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [languageDefault, setLanguageDefault] = useState(false);
  const [_wallet,] = useRecoilState(activeWallet);
  const [, setActiveNetwork] = useRecoilState(activeNetwork)
  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  const [hasSigned, setHasSigned] = useState(false);
  const {
    colorMode
  } = useColorMode();
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [loading, setLoading] = useState(true);
  //const [hasBooted, setHasBooted] = useState(false);


  //Loading Fonts
  useEffect(() => {
    const callAsync = async () => {
      await Font.loadAsync({
        Montserrat_400Regular,
        Montserrat_700Bold
      });
      const _language = await getLanguage();
      const _hasSigned = await hasSignedPrivacyPolicy();
      const _activeNetwork = await getActiveNetwork();
      if (isComponentMounted) {
        setFontsLoaded(true);

        setHasSigned(_hasSigned);
        if (_language) {
          setLanguageState(_language);
        } else {
          setLanguageState('en');
          setLanguageDefault(true);
        }

        if (_activeNetwork) {
          setActiveNetwork(_activeNetwork);
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

  useEffect(() => {
    let hasBooted = false;
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (!hasBooted) {
          console.log('calling bootstrap');
          hasBooted = true;
          await bootstrap();
        }
      }
      // eslint-disable-next-line functional/immutable-data
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const bootstrap = async () => {
    notifee.requestPermission().then(async (permission) => {
      if (permission) {
        const initialNotification = await notifee.getInitialNotification();
        if (initialNotification) {
          console.log('Notification caused application to open');
          // Add logic here that retrieves the event from storage and implements the WC Listener logic
          const event = await getNotification(initialNotification.pressAction.id);

          if (event !== null && event.params.request.method !== null) {
            //await deleteNotification(initialNotification.pressAction.id);
            if (
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA ||
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3 ||
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4
            ) {
              navigate('SignTyped', {
                requestDetails: event
              });
              return;
            } else if (
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN ||
              event.params.request.method === EIP155_SIGNING_METHODS.PERSONAL_SIGN
            ) {
              navigate('SignEth', {
                requestDetails: event
              });
              return;
            } else if (
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION
            ) {
              navigate('SignTransaction', {
                requestDetails: event
              })
              return;
            } else if (
              event.params.request.method === EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
            ) {
              navigate('SendTransaction', {
                requestDetails: event
              })
              return;
            } else {
              await defaultRouting();
              return;
            }
          } else {
            await defaultRouting();
            return;
          }
        } else {
          return;
        }
      } else {
        await defaultRouting();
        return;
      }
    }).catch((err) => {
      console.log('requestPermissionError', err);
    })
  }

  const defaultRouting = async () => {
    const _hasSigned = await hasSignedPrivacyPolicy();
    if (navigationRef.current?.getCurrentRoute()?.name === 'Home') {
      if (languageDefault) {
        navigate('Language', {});
      } else if (!_hasSigned) {
        navigate('PrivacyPolicy', {});
      } else if (_wallet.name !== '') {
        navigate('ViewWallet', {});
      } else {
        navigate('SelectWallet', {});
      }
    }
  }

  const handleLoad = async () => {
    bootstrap().then(async () => {
      await defaultRouting()
    }).catch(() => {
      console.log('load error');
    })
  }

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        handleLoad();
      }, 3000)
    }
  }, [loading])

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
    </>

  )
}
