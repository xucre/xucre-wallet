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
import React, {useEffect, useState} from "react";
import {Platform, StyleSheet} from 'react-native';
import { useRecoilState, useSetRecoilState, } from "recoil";

import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { language as stateLanguage, walletList } from "../../service/state";
import { loadWalletFromMnemonics} from '../../service/wallet'
import { storeWallet, WalletInternal } from "../../store/wallet";


export default function RecoverWallet ({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const toast = useToast();
  const setWalletList = useSetRecoilState(walletList);
  const [language, ] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonics, setConfirmMnemonics] = useState([] as string[]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mnemonicMatchComplete, setMnemonicMatchComplete] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
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

  function Instructions() {
    
    const createMnemonics = () => {
      //setLoading(true);
      setSteps(1)
      //runCreateAsync();
    }

    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Text>{translations[language as keyof typeof translations].RecoverWallet.instructions}</Text>
        <Button
          variant="outline"
          my={4} 
          rounded={100} 
          px={10}   
          onPress={createMnemonics}       
          isLoading={loading}  
        >
          <Text>{translations[language as keyof typeof translations].RecoverWallet.instructions_button}</Text>
        </Button>
      </VStack>
    );
  }

  function MnemonicError() {

    return (
      <>
        {(!mnemonicMatchComplete) && 
          <Text my={2} color={'danger.400'}>{translations[language as keyof typeof translations].RecoverWallet.mnemonic_not_complete}</Text>
        }
      </>
    )
  }

  function ConfirmMnemonicList() {
    const removeMnemonic = (word: any, n: number) => {
      const filteredList = confirmMnemonics.filter((val, i) => {
        return n !== i;
      });
      setConfirmMnemonics(filteredList);
    };
    function ListItem({value, index}: {value: string, index: number}) {
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
                  color : colorMode === 'dark' ? Color.black : Color.white,
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
                  color : 'transparent',
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
                  <ListItem value={val} index={i} key={i}/>
                );
              }
            })}
          </VStack>
          <VStack space={4} alignItems="center" justifyItems={'center'}>
            {confirmMnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <ListItem value={val} index={i} key={i}/>
                );
              }
            })}
          </VStack>
          <VStack space={4} alignItems="center" justifyItems={'center'}>
            {confirmMnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <ListItem value={val} index={i} key={i}/>
                );
              }
            })}
          </VStack>
        </HStack>
    );
  }
  

  const handleMnemonicChange = (text: string) => {
    if(text.length > 3 && text.endsWith(' ')) {
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
    setSteps(steps+1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      try {
        if (confirmMnemonics.length > 0 ) {
          const _wallet = await loadWalletFromMnemonics(confirmMnemonics);
          const walletInternal = new WalletInternal(_wallet.privateKey);
          walletInternal.name = name;
          await storeWallet(walletInternal);
          setWalletList((oldWalletList) => [
            ...oldWalletList,
            {
              address: _wallet.address,
              name,
              wallet: _wallet
            }
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
    <ScrollView style={{backgroundColor: colorMode === 'dark' ? Color.black : Color.white}} flex={1} px="3">          
      <KeyboardAvoidingView h={{
        base: "auto",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={-210}>
        {steps === 0 && 
          <Center>
            <VStack minW="300px" w="full" alignItems="center" flex="1" justifyContent="flex-start">
              <Heading mb={5} style={styles.recoverWallet} fontWeight={'normal'}><Text>Recover wallet</Text></Heading>
              <Text style={[styles.pleaseEnterThe, styles.theLayout]}>
                Please enter the name and the sequence of mnemonics from your original
                wallet creation proces
              </Text>
              <Box py={3}>
                <Text style={styles.walletName} textAlign={'center'}>
                  Wallet name
                </Text>

                <Input w="full" minH={12} value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].RecoverWallet.name_entry_input_placeholder} />
              </Box>
              
              <Box py={3}>
                <Text style={ styles.walletName} textAlign={'center'}>
                  Mnemonic
                </Text>            
                <Input minH={12} value={mnemonic} placeholder={translations[language as keyof typeof translations].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handleMnemonicChange(text)} w="full" />
                <ConfirmMnemonicList />
              </Box>
              <Button.Group>
                <Button w={'90%'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language as keyof typeof translations].RecoverWallet.save_button_loadingtext} isDisabled={!mnemonicMatchComplete || name.length === 0} _disabled={{backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400'}}>
                  <Text color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language as keyof typeof translations].RecoverWallet.save_button}</Text>
                </Button>   
              </Button.Group>     
            </VStack>
          
          </Center>
        }
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.transparent,
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    position: 'relative',
    textAlign: "left",
  },
  pleaseEnterThe: {
    textAlign: "center",
  },
  recoverWallet: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_2xl,
    fontWeight: "600",
  },  
  theLayout: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
  },
  walletName: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    fontWeight: "500",
  },    
})