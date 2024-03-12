/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextArea,
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
import { loadWalletFromPrivateKey } from '../../service/wallet'
import { storeWallet, WalletInternal } from "../../store/wallet";
import { decryptPK } from "../../store/setting";


export default function RecoverPrivateKey({ navigation }: { navigation: { navigate: Function } }) {
  const toast = useToast();
  const setWalletList = useSetRecoilState(walletList);
  const [language,] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const isComplete = privateKey.length > 0 && password.length > 0;
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const {
    colorMode
  } = useColorMode();

  const handlePrivateKeyChange = (text: string) => setPrivateKey(text);
  const handlePasswordChange = (text: string) => setPassword(text);
  const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => setName(event.nativeEvent.text);

  const saveWallet = () => {
    const runAsync = async () => {
      try {
        if (isComplete) {
          const _pk = await decryptPK(privateKey, password);
          const _wallet = await loadWalletFromPrivateKey(_pk);
          const walletInternal = {
            address: _wallet.address,
            name,
            wallet: _wallet.privateKey
          } as AppWallet;
          await storeWallet(walletInternal);
          setWalletList((oldWalletList) => [
            ...oldWalletList,
            walletInternal
          ]);
          setLoading(false);
          setTimeout(() => {
            navigation.navigate('SelectWallet');
          }, 100);

        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        toast.show({
          placement: "bottom",
          title: 'Error saving wallet',
        })
      }

    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);

  };

  return (
    <Center mt={5}>
      <VStack w="full" alignItems="center" flex="1" justifyContent="flex-start">
        <Text >{translations[language as keyof typeof translations].RecoverPrivateKey.instructions}</Text>
        <VStack py={3} space={2}>
          <Text textAlign={'center'}>
            {translations[language as keyof typeof translations].RecoverPrivateKey.wallet_name_label}
          </Text>
          <Input w="full" minH={12} value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].RecoverWallet.name_entry_input_placeholder} />
        </VStack>

        <VStack py={3} space={2}>
          <Text textAlign={'center'}>
            {translations[language as keyof typeof translations].RecoverPrivateKey.password_label}
          </Text>
          <Input type={'password'} minH={12} value={password} placeholder={translations[language as keyof typeof translations].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handlePasswordChange(text)} w="full" />
        </VStack>
        <VStack py={3} space={2}>
          <Text textAlign={'center'}>
            {translations[language as keyof typeof translations].RecoverPrivateKey.private_key_label}
          </Text>
          <TextArea value={privateKey} onChangeText={text => handlePrivateKeyChange(text)} w="full" autoCompleteType={false} />
        </VStack>
        <Button.Group>
          <Button w={'90%'} borderRadius={'full'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => { saveWallet(); }} isLoading={loading} isLoadingText={translations[language as keyof typeof translations].RecoverWallet.save_button_loadingtext} isDisabled={!isComplete || name.length === 0} _disabled={{ backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400' }}>
            <Text bold color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language as keyof typeof translations].RecoverWallet.save_button}</Text>
          </Button>
        </Button.Group>
      </VStack>
    </Center>
  );
}