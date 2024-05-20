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
import { useRecoilState, useSetRecoilState, } from "recoil";
import * as DocumentPicker from 'expo-document-picker';

import translations from "../../assets/translations";
import { AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { loadWalletFromPrivateKey } from '../../service/wallet'
import { storeWallet, WalletInternal } from "../../store/wallet";
import { decryptPK } from "../../store/setting";
import OutlinedButton from "../ui/OutlinedButton";
import { StorageAccessFramework } from "expo-file-system";


export default function RecoverPrivateKey({ navigation }: { navigation: { navigate: Function } }) {
  const toast = useToast();
  const setWalletList = useSetRecoilState(walletList);
  const [language,] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');
  const isComplete = file.length > 0 && password.length > 0;

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

  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false
    });
    if (result.assets && result.assets.length > 0) {
      const result2 = await StorageAccessFramework.readAsStringAsync(result?.assets[0].uri);
      setFile(result2);
    }
  }

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
        <VStack py={3} space={2} w="90%">
          {file.length === 0 &&
            <OutlinedButton
              variant={'contained'}
              w={'full'}
              textAlign={'center'}
              py={4}
              mb={8}
              onPress={() => { selectFile(); }}
              buttonText={translations[language as keyof typeof translations].RecoverWallet.select_button || 'Select File'}
            />
          }
          {file.length > 0 &&
            <>
              <Text textAlign={'center'}>
                {translations[language as keyof typeof translations].RecoverPrivateKey.private_key_label}
              </Text>
              <TextArea value={file} isDisabled={true} w="full" autoCompleteType={false} />
            </>
          }

        </VStack>
        <Button.Group>
          <OutlinedButton
            variant={'ghost'}
            w={'90%'}
            py={4}
            onPress={() => { saveWallet(); }}
            isLoading={loading}
            isLoadingText={translations[language as keyof typeof translations].RecoverWallet.save_button_loadingtext}
            isDisabled={!isComplete || name.length === 0}
            buttonText={translations[language as keyof typeof translations].RecoverWallet.save_button}
          />
        </Button.Group>
      </VStack>
    </Center>
  );
}