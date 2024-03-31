/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from 'react-native';
import { useRecoilState, useSetRecoilState, } from "recoil";

import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { loadWalletFromMnemonics } from '../../service/wallet'
import { storeWallet, WalletInternal } from "../../store/wallet";
import RecoverMnemonic from "../../components/wallet/RecoverMnemonic";
import RecoverPrivateKey from "../../components/wallet/RecoverPrivateKey";
import ContainedButton from "../../components/ui/ContainedButton";
import OutlinedButton from "../../components/ui/OutlinedButton";


export default function RecoverWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const {
    colorMode
  } = useColorMode();

  function Instructions() {

    const createMnemonics = () => setSteps(1);
    const createPrivateKey = () => setSteps(2);

    return (
      <Box h={'2xl'} justifyContent={'center'}>
        <VStack justifyContent={'center'}>
          <Center>
            <Heading mb={5} fontWeight={'normal'}><Text>{translations[language as keyof typeof translations].RecoverWallet.header}</Text></Heading>
          </Center>
          <VStack space={2} alignContent={'center'} mt={{ base: 0 }}>
            <ContainedButton
              variant={'solid'}
              py={6}
              rounded={100}
              onPress={createMnemonics}
              isLoading={loading}
              buttonText={translations[language as keyof typeof translations].RecoverWallet.mnemonic_button}
            />
            <OutlinedButton
              variant={'outlined'}
              py={6}
              onPress={createPrivateKey}
              isLoading={loading}
              buttonText={translations[language as keyof typeof translations].RecoverWallet.private_key_button}
            />
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView h={'full'}>
      <KeyboardAvoidingView h={{
        base: "auto",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
        {steps === 0 &&
          <Instructions />
        }

        <VStack space={2} >
          {steps === 1 &&
            <RecoverMnemonic navigation={navigation} />
          }
          {steps === 2 &&
            <RecoverPrivateKey navigation={navigation} />
          }
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}