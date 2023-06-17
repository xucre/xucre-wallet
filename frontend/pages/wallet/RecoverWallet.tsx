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
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  TextArea,
  useColorMode,
  useColorModeValue,
  useToast,
  View,
  VStack,
} from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import {StyleSheet} from 'react-native';
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
    const areValidEntries = mnemonic.split(' ').reduce((prev, curr) => {
      if (curr.length > 0 && prev === 'true') {
        return 'true';
      } else {
        return 'false';
      }      
    }, 'true');
    if (mnemonic.split(' ').length === 12 && areValidEntries === 'true') {
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
          const _wallet = await loadWalletFromMnemonics(mnemonic);
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
    <View style={{backgroundColor: colorMode === 'dark' ? Color.gray_200 : Color.white}}>
    <ScrollView w={'full'} h={'full'} marginTop={200}>
     {/*  {steps === 0 && 
        <Instructions></Instructions>
      } */}

      {steps === 0 && 
        <>
          <Box alignItems="center" marginBottom={250}>
            <Text style={[styles.recoverWallet, styles.walletClr]}>
              Recover wallet
            </Text>
            <Text style={[styles.pleaseEnterThe, styles.theLayout]}>
              Please enter the name and the sequence of mnemonics from your original
              wallet creation proces
            </Text>
            <Text
            style={[
              styles.walletName,
              styles.walletClr,
              styles.groupChildPosition,
            ]}
            >
              Wallet name
            </Text>

            <View style={styles.containerText}>
              <Input  w="90%" value={name} onChange={handleNameChange} placeholder={translations[language].RecoverWallet.name_entry_input_placeholder} my={7} />
            </View>

            <Text
              style={[
                styles.walletName,
                styles.walletClr,
                styles.groupChildPositionArea,
              ]}
            >
              Mnemonic phrase
            </Text>

            <View style={styles.containerTextArea} >
              <TextArea totalLines={3} autoCompleteType={'off'} value={mnemonic} placeholder={translations[language].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handleMnemonicChange(text)} w="90%" />
            </View>            
            
          </Box>
          <Button style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].RecoverWallet.save_button_loadingtext} isDisabled={!mnemonicMatchComplete || name.length === 0} _disabled={{backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400'}}>
            <Text color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language].RecoverWallet.save_button}</Text>
          </Button>
        </>
      }
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    position: 'relative',
    textAlign: "left",
    width: '100%',
  },
  containerText:{
    top: 130
  },
  containerTextArea:{
    fontWeight: 300,
    top: 155,
  },
  groupChildPosition: {
    left: 30,
    top: 130,
  },
  groupChildPositionArea: {
    left: 30,
    top: 230,
  },
  pleaseEnterThe: {
    left: 40,
    textAlign: "center",
    top: 50,
  },
  recoverWallet: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_2xl,
    fontWeight: "600",
    left: 135,
    lineHeight: 30,
    textAlign: "left",
    top: 0,
  },  
  theLayout: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
    position: "absolute",
    width: 306,
  },
  walletClr: {
    letterSpacing: -0.2,
    position: "absolute",
    textAlign: "left",
  },
  walletName: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "left",
    top: 0,
    width: 316,
  },    
})