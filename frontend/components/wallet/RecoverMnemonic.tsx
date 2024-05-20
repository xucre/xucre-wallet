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
import ContainedButton from "../ui/ContainedButton";
import OutlinedButton from "../ui/OutlinedButton";


export default function RecoverMnemonic({ navigation }: { navigation: { navigate: Function } }) {
  const toast = useToast();
  const setWalletList = useSetRecoilState(walletList);
  const [language,] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonics, setConfirmMnemonics] = useState([] as string[]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mnemonicMatchComplete, setMnemonicMatchComplete] = useState(false);

  const {
    colorMode
  } = useColorMode();

  useEffect(() => {
    // Add Whitespace trimming
    if ((confirmMnemonics.length === 12)) {
      setMnemonicMatchComplete(true);
    } else {
      setMnemonicMatchComplete(false);
    }

  }, [confirmMnemonics]);

  function ConfirmMnemonicList() {
    const removeMnemonic = (word: any, n: number) => {
      const filteredList = confirmMnemonics.filter((val, i) => {
        return n !== i;
      });
      setConfirmMnemonics(filteredList);
    };
    function ListItem({ value, index }: { value: string, index: number }) {
      return (
        <Button
          width={'100%'}
          bg="Color.gray_100"
          rounded="sm"
          _text={{
            alignContent: 'center',
            color: Color.gray_200,
            fontWeight: "medium",
            justifyContent: 'center',
          }}
          variant={'unstyled'}
          alignSelf={'center'}
          margin={1}
          alignItems={'center'}
          justifyContent={'flex-start'}
          shadow={"3"}

          onPress={() => {
            setTimeout(() => {
              removeMnemonic(value, index);
            }, 1)

          }}
          startIcon={
            confirmMnemonics.includes(value) ?
              <Badge
                colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                rounded="full"
                zIndex={100}
                variant="solid"
                alignSelf="flex-start"
                _text={{
                  fontSize: 12,
                }}
                margin={2}
              >
                <Text style={{
                  color: colorMode === 'dark' ? Color.black : Color.white,
                }}>{confirmMnemonics.indexOf(value) + 1}</Text>
              </Badge> :
              <Badge
                backgroundColor={'transparent'}
                rounded="full"
                zIndex={100}
                variant="solid"
                alignSelf="flex-start"
                _text={{
                  fontSize: 12,
                }}
                marginY={2}
              >
                <Text style={{
                  color: 'transparent',
                }}></Text>
              </Badge>
          }
        >
          <Text >{value}</Text>
        </Button>
      )
    };
    return (
      <HStack
        style={{
          paddingBottom: 10,
        }}
        maxW={'full'}
      >
        <VStack space={4} alignItems="center" justifyItems={'center'}>
          {confirmMnemonics.map((val, i) => {
            if (i % 3 === 0) {
              return (
                <ListItem value={val} index={i} key={i} />
              );
            }
          })}
        </VStack>
        <VStack space={4} alignItems="center" justifyItems={'center'}>
          {confirmMnemonics.map((val, i) => {
            if (i % 3 === 1) {
              return (
                <ListItem value={val} index={i} key={i} />
              );
            }
          })}
        </VStack>
        <VStack space={4} alignItems="center" justifyItems={'center'}>
          {confirmMnemonics.map((val, i) => {
            if (i % 3 === 2) {
              return (
                <ListItem value={val} index={i} key={i} />
              );
            }
          })}
        </VStack>
      </HStack>
    );
  }

  const handleMnemonicChange = (text: string) => {
    if (text.length > 3 && text.endsWith(' ')) {
      if (confirmMnemonics.length < 12) {
        setConfirmMnemonics([...confirmMnemonics, text.trim()])
      }
      setMnemonic('');
    } else {
      setMnemonic(text)
    }
  }
  const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setName(event.nativeEvent.text);
  }

  function nextStep() {
    setSteps(steps + 1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      try {
        if (confirmMnemonics.length > 0) {
          const _wallet = await loadWalletFromMnemonics(confirmMnemonics);
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

  const isDisabled = !mnemonicMatchComplete || name.length === 0;

  return (
    <Box h={'full'}>
      <VStack w="full" py={10} alignItems="center" flex="1" justifyContent="flex-start">
        <Text >{translations[language as keyof typeof translations].RecoverMnemonic.instructions}</Text>
        <VStack py={3} space={2}>
          <Text textAlign={'center'}>
            {translations[language as keyof typeof translations].RecoverMnemonic.wallet_name_label}
          </Text>

          <Input w="full" minH={12} value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].RecoverWallet.name_entry_input_placeholder} />
        </VStack>

        <Box py={3}>
          <Text textAlign={'center'} py={4}>
            {translations[language as keyof typeof translations].RecoverMnemonic.mnemonic_label}
          </Text>
          <Input minH={12} value={mnemonic} placeholder={translations[language as keyof typeof translations].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handleMnemonicChange(text)} w="full" />
          <ConfirmMnemonicList />
        </Box>
        {!isDisabled &&
          <Button.Group>
            <OutlinedButton
              variant={'ghost'}
              w={'90%'}
              py={4}
              onPress={() => { saveWallet(); }}
              isLoading={loading}
              isLoadingText={translations[language as keyof typeof translations].RecoverWallet.save_button_loadingtext}
              isDisabled={isDisabled}
              buttonText={translations[language as keyof typeof translations].RecoverWallet.save_button}
            />
          </Button.Group>
        }

      </VStack>
    </Box>
  );
}