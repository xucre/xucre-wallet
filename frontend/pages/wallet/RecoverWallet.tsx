import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {StyleSheet} from 'react-native';
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
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
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
    <View style={{backgroundColor: Color.gray_200}}>
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
          <Button style={styles.buttonContainer} onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].RecoverWallet.save_button_loadingtext} isDisabled={!mnemonicMatchComplete || name.length === 0} _disabled={{backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400'}}>
            <Text>{translations[language].RecoverWallet.save_button}</Text>
          </Button>
         
        </>
      }
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  buttonContainer: {
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#CEF213',
    position: 'relative',
    width: 370,
    left: 20,
    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#fff',

  },
  containerTextArea:{
    top: 155,
    fontWeight: 300
  },
  containerText:{
    top: 130
  },
  recoverWallet: {
    top: 0,
    left: 135,
    fontSize: FontSize.size_2xl,
    lineHeight: 30,
    textAlign: "left",
    fontFamily: FontFamily.interSemibold,
    fontWeight: "600",
    color: Color.white,
  }, walletClr: {
    color: Color.white,
    textAlign: "left",
    letterSpacing: -0.2,
    position: "absolute",
  },pleaseEnterThe: {
    top: 50,
    left: 40,
    color: Color.darkgray_100,
    textAlign: "center",
  },theLayout: {
    width: 306,
    fontFamily: FontFamily.interRegular,
    lineHeight: 21,
    letterSpacing: -0.2,
    fontSize: FontSize.size_base,
    position: "absolute",
  },walletName: {
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    width: 316,
    textAlign: "left",
    color: Color.white,
    lineHeight: 21,
    fontSize: FontSize.size_base,
    top: 0,
  },   walletClr: {
    color: Color.white,
    textAlign: "left",

    letterSpacing: -0.2,
    position: "absolute",
  },   groupChildPosition: {
    top: 130,
    left: 30,
  },
  groupChildPositionArea: {
    top: 230,
    left: 30,
  },
  rectangleGroup: {
    top: 27,
  },   groupLayout: {
    height: 47,
    width: 351,
    left: 0,
    position: "absolute",
  },groupBorder: {
    borderWidth: 1,
    borderColor: "#7b7b7b",
    borderStyle: "solid",
    backgroundColor: Color.gray_300,
    borderRadius: Border.br_xs,
    top: 0,
  },
})