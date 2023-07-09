import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  Drawer,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  KeyboardAvoidingView,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  TextArea,
  useColorMode,
  useColorModeValue,
  useSafeArea,
  useToast,
  View,
  VStack,
} from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import {Platform, StyleSheet} from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { language as stateLanguage, walletList } from "../../service/state";
import { loadWalletFromMnemonics} from '../../service/wallet'
import { storeWallet } from "../../store/wallet";


export default function RecoverWallet ({navigation, route, storage}) {
  const toast = useToast();
  const setWalletList = useSetRecoilState(walletList);
  const [language, ] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [mnemonic, setMnemonic] = useState('');
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
    const areValidEntries = mnemonic.split(' ').reduce((prev, curr) => {
      if (curr.length > 0 && prev === 'true') {
        return 'true';
      } else {
        return 'false';
      }      
    }, 'true');
    const trimmedMnemonics = mnemonic.split(' ').filter((val, i) => {
      return val !== '' && val !== ' ';
    })
    if ((trimmedMnemonics.length === 12) && areValidEntries === 'true') {
      setMnemonicMatchComplete(true); 
    } else {
      setMnemonicMatchComplete(false); 
    }
       
  }, [mnemonic]);

  function Instructions() {
    
    const createMnemonics = () => {
      //setLoading(true);
      setSteps(1)
      //runCreateAsync();
    }

    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Text>{translations[language].RecoverWallet.instructions}</Text>
        <Button
          variant="outline"
          my={4} 
          rounded={100} 
          px={10}   
          onPress={createMnemonics}       
          isLoading={loading}  
        >
          <Text>{translations[language].RecoverWallet.instructions_button}</Text>
        </Button>
      </VStack>
    );
  }

  function MnemonicError() {

    return (
      <>
        {(!mnemonicMatchComplete) && 
          <Text my={2} color={'danger.400'}>{translations[language].RecoverWallet.mnemonic_not_complete}</Text>
        }
      </>
    )
  }
  

  const handleMnemonicChange = (text) => {
    //console.log(event.nativeEvent.text);
    setMnemonic(text)
  }
  const handleNameChange = (event) => {
    setName(event.nativeEvent.text);
  }

  function nextStep() {    
    setSteps(steps+1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      try {
        if (mnemonic.length > 0 ) {
          console.log('save your wallet');
          const trimmedMnemonics = mnemonic.split(' ').filter((val, i) => {
            return val !== '' && val !== ' ';
          })
          const _wallet = await loadWalletFromMnemonics(trimmedMnemonics);
          //console.log(_wallet.privateKey, name);
          
          await storeWallet({name, wallet: _wallet.privateKey});
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
        console.log(err);
        setLoading(false);
        toast.show({
          placement: "bottom",
          title: err.message,
        })
      }
      
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
    
  };

  return (
    <Center style={{backgroundColor: colorMode === 'dark' ? Color.gray_200 : Color.white}} flex={1} px="3">          
      <KeyboardAvoidingView h={{
        base: "400px",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
     {/*  {steps === 0 && 
        <Instructions></Instructions>
      } */}

      {steps === 0 && 
        
        <Center>
          <VStack minW="300px" w="100%" alignItems="center" flex="1" justifyContent="flex-start">
            <Heading mb={5} style={styles.recoverWallet} fontWeight={'normal'}><Text>Recover wallet</Text></Heading>
            <Text style={[styles.pleaseEnterThe, styles.theLayout]}>
              Please enter the name and the sequence of mnemonics from your original
              wallet creation proces
            </Text>
            <Box py={3}>
              <Text style={styles.walletName} textAlign={'center'}>
                Wallet name
              </Text>

              <Input  w="90%" value={name} onChange={handleNameChange} placeholder={translations[language].RecoverWallet.name_entry_input_placeholder} />
            </Box>
            
            <Box py={3}>
              <Text style={ styles.walletName} textAlign={'center'}>
                Mnemonic phrase
              </Text>            
              <TextArea totalLines={3} autoCompleteType={'off'} value={mnemonic} placeholder={translations[language].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handleMnemonicChange(text)} w="90%" />
            </Box>
              <Button w={'90%'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].RecoverWallet.save_button_loadingtext} isDisabled={!mnemonicMatchComplete || name.length === 0} _disabled={{backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400'}}>
                <Text color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language].RecoverWallet.save_button}</Text>
              </Button>        
          </VStack>
        
        </Center>
    
      }
    
      </KeyboardAvoidingView>
    </Center>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.transparent,
    borderRadius: Border.br_sm,
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