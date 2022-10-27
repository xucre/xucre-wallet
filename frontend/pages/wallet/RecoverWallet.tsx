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
  VStack,
} from "native-base";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";


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
            {name, wallet: _wallet}
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
    <ScrollView w={'full'} h={'full'} marginTop={5}>
      {steps === 0 && 
        <Instructions></Instructions>
      }

      {steps === 1 && 
        <>
          <Box alignItems="center" marginBottom={3}>
            <Input w="100%" value={name} onChange={handleNameChange} placeholder={translations[language].RecoverWallet.name_entry_input_placeholder} my={4} />
            <TextArea totalLines={3} autoCompleteType={'off'} value={mnemonic} placeholder={translations[language].RecoverWallet.mnemonic_entry_input_placeholder} onChangeText={text => handleMnemonicChange(text)} w="100%" />
            <MnemonicError/>
          </Box>
          <Button onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].RecoverWallet.save_button_loadingtext} isDisabled={!mnemonicMatchComplete || name.length === 0} _disabled={{backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400'}}>
            <Text>{translations[language].RecoverWallet.save_button}</Text>
          </Button>
        </>
      }
    </ScrollView>
  );
}
