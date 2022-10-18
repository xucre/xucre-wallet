/* eslint-disable react-native/no-inline-styles */
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
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";


import translations from "../../assets/translations";
import { language as stateLanguage, walletList } from "../../service/state";
import {generateMnemonics, loadWalletFromMnemonics} from '../../service/wallet'
import { storeWallet } from "../../store/wallet";


export default function CreateWallet ({navigation, route, storage}) {
  const setWalletList = useSetRecoilState(walletList);
  const [language, ] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mnemonics, setMnemonics] = useState([]);
  const [scrambledMnemonics, setScrambledMnemonics] = useState([]);
  const [confirmMnemonics, setConfirmMnemonics] = useState([]);
  const [mnemonicMatchError, setMnemonicMatchError] = useState(false);
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
    if (confirmMnemonics.length > 0) {
      const isMatching = confirmMnemonics.map((current, i) => {
        return current === mnemonics[i]
      });
      setMnemonicMatchError(isMatching.includes(false));
      if (!isMatching.includes(false) && confirmMnemonics.length === mnemonics.length) {
        setMnemonicMatchComplete(true);
      } else {
        setMnemonicMatchComplete(false);
      }
    } else {
      setMnemonicMatchError(false);
    }
  }, [confirmMnemonics]);

  function Instructions() {
    const runCreateAsync = async () => {
      // test
      setTimeout(() => {
        const _mnemonics = generateMnemonics(language);
        //console.log(_mnemonics);

        setSteps(steps+1);
        setMnemonics(_mnemonics);
        setScrambledMnemonics(arrayShuffle(_mnemonics));
        setLoading(false);
        // only used for testing
        setConfirmMnemonics(_mnemonics);
        setMnemonicMatchComplete(true);
      }, 100)
      
    }
    const createMnemonics = () => {
      setLoading(true);
      runCreateAsync();
    }

    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Text>{translations[language].CreateWallet.instructions}</Text>
        <Button
          variant="outline"
          my={4} 
          rounded={100} 
          px={10}   
          onPress={createMnemonics}       
          isLoading={loading}  
        >
          <Text>{translations[language].CreateWallet.instructions_button}</Text>
        </Button>
      </VStack>
    );
  }

  function MnemonicList() {
    return (
      <Grid style={{alignItems: 'center', justifyContent: 'center',marginTop:0, paddingBottom:10}}>
        <Col></Col>
        <Col>
          {
            mnemonics.map((val, i) => {
              if (i%2 === 0) {
                return (
                  <VStack key={val}>
                    <Badge colorScheme="gray" rounded="full" mb={-4} mr={-1} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                        fontSize: 12
                      }}>
                      <Text>{i+1}</Text>
                    </Badge>
                    <Button size="16" bg="primary.400" rounded="sm" _text={{
                        color: "warmGray.50",
                        fontWeight: "medium"
                      }} margin={1} shadow={"3"} key={val}>
                        <Text>{val}</Text>
                    </Button>
                  </VStack>                  
                )
              }
            })
          }
        </Col>
        <Col></Col>
        <Col>
          {
            mnemonics.map((val, i) => {
              if (i%2 === 1) {
                return (
                  <VStack key={val}>
                    <Badge colorScheme="gray" rounded="full" mb={-4} mr={-1} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                        fontSize: 12
                      }}>
                      <Text>{i+1}</Text>
                    </Badge>
                    <Button size="16" bg="primary.400" rounded="sm" _text={{
                        color: "warmGray.50",
                        fontWeight: "medium"
                      }} margin={1} shadow={"3"} key={val}>
                        <Text>{val}</Text>
                    </Button>
                  </VStack> 
                )
              }
            })
          }
        </Col>
        <Col></Col>
      </Grid>
    );
  }

  function ConfirmMnemonicList() {
    const selectMnemonic = (word) => {
      setConfirmMnemonics([...confirmMnemonics, word]);
    };
    const removeMnemonic = (word) => {
      const filteredList = confirmMnemonics.filter((val) => {
        return val !== word;
      });
      setConfirmMnemonics(filteredList);
    }
    return (
      <Grid style={{alignItems: 'center', justifyContent: 'center',marginTop:10, paddingBottom:10}}>
        <Col></Col>
        <Col>
          {
            scrambledMnemonics.map((val, i) => {
              if (i%2 === 0) {
                return (
                  <Box alignItems="center" key={val+i}>
                    <VStack>
                      {confirmMnemonics.includes(val) &&
                        <Pressable onPress={() => {removeMnemonic(val)}}  zIndex={1000}>
                          <Badge colorScheme="gray" rounded="full" mb={-4} mr={-4} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                              fontSize: 12
                            }}>
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      }
                      {confirmMnemonics.includes(val) && 
                        <Badge colorScheme="gray" rounded="full" mb={-4} mr={-4} zIndex={100} variant="solid" alignSelf="flex-start"  _text={{
                          fontSize: 12
                        }}>
                          <Text>{confirmMnemonics.indexOf(val)+1}</Text>
                        </Badge>
                      }
                      
                      <Button size="16" bg="primary.400" rounded="sm" _text={{
                        color: "warmGray.50",
                        fontWeight: "medium"
                      }} margin={1} shadow={"3"} key={val} onPress={() => {selectMnemonic(val)}} disabled={confirmMnemonics.includes(val)}>
                          <Text>{val}</Text>
                      </Button>
                    </VStack>
                  </Box>
                )
              }
            })
          }
        </Col>
        <Col></Col>
        <Col>
          {
            scrambledMnemonics.map((val, i) => {
              if (i%2 === 1) {
                return (
                  <Box alignItems="center" key={val+i}>
                    <VStack>
                      {confirmMnemonics.includes(val) &&
                        <Pressable onPress={() => {removeMnemonic(val)}} zIndex={1000}>
                          <Badge colorScheme="coolGray" rounded="full" mb={-4} mr={-4} zIndex={10000} variant="solid" alignSelf="flex-end" _text={{
                              fontSize: 12
                            }}>
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      }
                      {confirmMnemonics.includes(val) && 
                        <Badge colorScheme="gray" rounded="full" mb={-4} mr={-4} zIndex={100} variant="solid" alignSelf="flex-start" _text={{
                          fontSize: 12
                        }}>
                          <Text>{confirmMnemonics.indexOf(val)+1}</Text>
                        </Badge>
                      }
                      
                      <Button size="16" bg="primary.400" rounded="sm" _text={{
                        color: "warmGray.50",
                        fontWeight: "medium"
                      }} margin={1} shadow={"3"} key={val} onPress={() => {selectMnemonic(val)}}>
                          <Text>{val}</Text>
                      </Button>
                    </VStack>
                  </Box>
                )
              }
            })
          }
        </Col>
        <Col></Col>
      </Grid>
    );
  }

  function MnemonicError() {

    return (
      <>
        {mnemonicMatchError && 
          <Alert w="100%" status={'error'}>
            <Center><Text color="coolGray.800">{translations[language].CreateWallet.mnemonic_error}</Text></Center>
          </Alert>          
        }
        {(mnemonicMatchComplete) && 
          <Button onPress={nextStep}><Text>{translations[language].CreateWallet.mnemonic_error_button}</Text></Button>
        }
      </>
    )
  }
  
  function WalletName() {
    
    return (
      <>
        <Box alignItems="center">
          <Input w="100%" value={name} onChange={handleChange} placeholder="Set Wallet Name"  />
        </Box>
      </>
    )
  }

  const handleChange = (event) => {
    //console.log(event.nativeEvent.text);
    setName(event.nativeEvent.text)
  }

  function nextStep() {    
    setSteps(steps+1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      if (confirmMnemonics.length > 0 && name.length > 0 ) {
        console.log('save your wallet');
        const _wallet = await loadWalletFromMnemonics(confirmMnemonics);
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
        <Box h={'full'}>
          <Center _text={{ color: "warmGray.50", fontWeight: "medium" }} marginBottom={0} paddingBottom={0}><Text paddingTop={5} paddingBottom={5}>{translations[language].CreateWallet.mnemonic_confirm_instructions}</Text></Center>
          <MnemonicList></MnemonicList>
          <Button onPress={nextStep}><Text>{translations[language].CreateWallet.mnemonic_confirm_button}</Text></Button>
        </Box>
      }
      
      {steps === 2 && 
        <>
          <ConfirmMnemonicList></ConfirmMnemonicList>
          <MnemonicError></MnemonicError>          
        </>
      }

      {steps === 3 && 
        <>
          <Box alignItems="center" marginBottom={3}>
            <Input w="100%" value={name} onChange={handleChange} placeholder={translations[language].CreateWallet.name_entry_input_placeholder}  />
          </Box>
          <Button onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].CreateWallet.name_entry_button_loadingtext} disabled={confirmMnemonics.length < mnemonics.length || name.length === 0}><Text>{translations[language].CreateWallet.name_entry_button}</Text></Button>
        </>
      }
    </ScrollView>
  );
}
