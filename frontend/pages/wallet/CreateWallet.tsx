/* eslint-disable react-native/no-single-element-style-arrays */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {StyleSheet} from 'react-native';
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import DashboardLayout from '../../layouts/DashboardLayout';
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
  View,
  VStack,
} from "native-base";
import { background, color } from "native-base/lib/typescript/theme/styled-system";
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
        console.log('generateMnemonics('+language+')')
        const _mnemonics = generateMnemonics(language);
        console.log(_mnemonics);

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
      <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
          <Text  style={{color: 'white', fontWeight: 'bold'}} fontSize={'lg'} mt={5}>{translations[language].CreateWallet.instructions_newWwallet}</Text>
          <Text style={{color: Color.gray_100, marginLeft: 15, marginRight: 15, textAlign: 'center'}}fontSize={'md'} mt={5}>{translations[language].CreateWallet.instructions}</Text>
            <Button style={[styles.buttonContainer]} onPress={createMnemonics} isLoading={loading} ><Text style={{color: '#000'}}>{translations[language].CreateWallet.instructions_button}</Text></Button> 
      </Box>
    );
  }

  function MnemonicList() {
    return (
      
        <><Text style={{ color: Color.gray_100, marginLeft: 15, marginRight: 15, textAlign: 'center' }} fontSize={'md'} mt={5}>{translations[language].CreateWallet.mnemonic_instructions}</Text>
        <Grid style={{ alignItems: 'center', justifyContent: 'center', marginTop: 0, paddingBottom: 10 }}>

          
          <Col>
            {mnemonics.map((val, i) => {
              if (i % 3 === 0) {
                return (
                  <VStack key={val}>
                    <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                      fontSize: 12
                    }}>
                      <Text>{i + 1}</Text>
                    </Badge>
                    <Button left={25} width={101} height={50} bg="Color.gray_100" rounded="sm" _text={{
                      color: Color.gray_200,
                      fontWeight: "medium"
                    }} margin={1} shadow={"3"} key={val}>
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
            {mnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <VStack key={val}>
                    <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                      fontSize: 12
                    }}>
                      <Text>{i + 1}</Text>
                    </Badge>
                    <Button width={120} height={50} bg="Color.gray_100" rounded="sm" _text={{
                      color: "warmGray.50",
                      fontWeight: "medium"
                    }} margin={1} shadow={"3"} key={val}>
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
          
          {mnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <VStack key={val}>
                    <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-end" _text={{
                      fontSize: 12
                    }}>
                      <Text>{i + 1}</Text>
                    </Badge>
                    <Button right={3} width={120} height={50} bg="Color.gray_100" rounded="sm" _text={{
                      color: "warmGray.50",
                      fontWeight: "medium"
                    }} margin={1} shadow={"3"} key={val}>
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}

          </Col>
          <Col></Col>
        </Grid></>
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
      <><Text style={{ color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={'md'} mt={5}>{translations[language].CreateWallet.mnemonic_instructions}</Text>


      <Grid style={{alignItems: 'center', justifyContent: 'center',marginTop:10, paddingBottom:10}}>
        <Col></Col>
        <Col>
          {
            scrambledMnemonics.map((val, i) => {
              if (i%3 === 0) {
                return (
                  <Box alignItems="center" key={val+i}>
                    <VStack>
                      {confirmMnemonics.includes(val) &&
                        <Pressable onPress={() => {removeMnemonic(val)}}  zIndex={1000}>
                          <Badge colorScheme="gray" rounded="full" mb={-4} mr={-1} zIndex={1000} variant="solid" alignSelf="flex-end" _text={{
                              fontSize: 12
                            }}>
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      }
                      {confirmMnemonics.includes(val) && 
                      
                        <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-start"  _text={{
                          fontSize: 12
                        }}>
                          <Text>{confirmMnemonics.indexOf(val)+1}</Text>
                        </Badge>
                      }
                      
                      <Button left={15} width={100} height={50} bg="Color.gray_100" rounded="sm" _text={{
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
              if (i%3 === 1) {
                return (
                  <Box alignItems="center" key={val+i}>
                    <VStack>
                      {confirmMnemonics.includes(val) &&
                        <Pressable onPress={() => {removeMnemonic(val)}} zIndex={1000}>
                          <Badge colorScheme="coolGray" rounded="full" mb={-4} mr={-1} zIndex={10000} variant="solid" alignSelf="flex-end" _text={{
                              fontSize: 12
                            }}>
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      }
                      {confirmMnemonics.includes(val) && 
                        <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-start" _text={{
                          fontSize: 12
                        }}>
                          <Text>{confirmMnemonics.indexOf(val)+1}</Text>
                        </Badge>
                      }
                      
                      <Button width={100} height={50} bg="Color.gray_100"  rounded="sm" _text={{
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
        <Col>
        {
            scrambledMnemonics.map((val, i) => {
              if (i%3 === 2) {
                return (
                  <Box alignItems="center" key={val+i}>
                    <VStack>
                      {confirmMnemonics.includes(val) &&
                        <Pressable onPress={() => {removeMnemonic(val)}} zIndex={1000}>
                          <Badge colorScheme="coolGray" rounded="full" mb={-4} mr={0} zIndex={10000} variant="solid" alignSelf="flex-end" _text={{
                              fontSize: 12
                            }}>
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      }
                      {confirmMnemonics.includes(val) && 
                        <Badge colorScheme="primary.400" rounded="full" mb={-4} mr={11} zIndex={100} variant="solid" alignSelf="flex-start" _text={{
                          fontSize: 12
                        }}>
                          <Text>{confirmMnemonics.indexOf(val)+1}</Text>
                        </Badge>
                      }
                      
                      <Button right={3} width={120} height={50} bg="Color.gray_100" rounded="sm" _text={{
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
      </Grid></>
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
          <Button style={styles.buttonMneminic} onPress={nextStep}><Text style={{color: '#000', fontWeight: 'bold',}} >{translations[language].CreateWallet.mnemonic_error_button}</Text></Button>
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
        
      }
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
    
  };

  return (
    <View style={{backgroundColor: Color.gray_200}}>
    <ScrollView w={'full'} h={'full'} marginTop={150}>
      {steps === 0 && 
        <Instructions></Instructions>
      }
      
      {steps === 1 && 
         <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'} flex={2}>
          <Center _text={{ color: "warmGray.50", fontWeight: "medium" }} marginBottom={0} paddingBottom={0}><Text paddingTop={5} paddingBottom={5}>{translations[language].CreateWallet.mnemonic_confirm_instructions}</Text></Center>
          <MnemonicList></MnemonicList>
          <Button style={styles.buttonMneminic} onPress={nextStep}><Text style={{color: '#000', fontWeight: 'bold',}} >{translations[language].CreateWallet.mnemonic_confirm_button}</Text></Button>
        </Box>
      }
      
      {steps === 2 && 
        <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'} flex={2}>
        <Center _text={{ color: "warmGray.50", fontWeight: "medium" }} marginBottom={0} paddingBottom={0}><Text paddingTop={5} paddingBottom={5}>{translations[language].CreateWallet.mnemonic_confirm_instructions}</Text></Center>
          <ConfirmMnemonicList></ConfirmMnemonicList>
          <MnemonicError></MnemonicError>          
          </Box>
      }

      {steps === 3 && 
     
        <Box alignItems="center" marginBottom={20} h={'800'} w ={'full'} flex={3}>
          <Text  style={{color: '#fff', fontWeight: 'bold'}} fontSize={'lg'} mt={5}>{translations[language].CreateWallet.name_wallet}</Text>
          <Text style={{color: Color.gray_100, marginLeft: 15, marginRight: 15, textAlign: 'center'}}fontSize={'md'} mt={5}>{translations[language].CreateWallet.instructions_nameWallet}</Text>
          <Input w="85%" top={70} value={name} onChange={handleChange} placeholder={translations[language].CreateWallet.name_entry_input_placeholder}  />
          <Button style={styles.buttonSave}  onPress={() => {saveWallet();}} isLoading={loading} isLoadingText={translations[language].CreateWallet.name_entry_button_loadingtext} py={5} disabled={confirmMnemonics.length < mnemonics.length || name.length === 0}><Text style={{color: '#000', fontWeight: 'bold'}}>{translations[language].CreateWallet.name_entry_button}</Text></Button>
          </Box>
      }
    </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({

  buttonSave:{
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#D4E815',
    position: 'absolute',
    width: 350,
    top: 250,
    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000',
  },
  buttonMneminic: {
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#D4E815',
    position: 'absolute',
    width: 350,
    top: 450,
    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000',
  },
  
  buttonContainer: {
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#D4E815',
    position: 'relative',
    width: 350,
    left: 0,
    top: 80,
    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000',

  },

  // eslint-disable-next-line react-native/no-unused-styles
  createANew: {
    top: 230,
    // eslint-disable-next-line sort-keys
    fontSize: FontSize.size_base,
    lineHeight: 21,
    fontFamily: FontFamily.interRegular,
    color: Color.darkgray_100,
    textAlign: "center",
    letterSpacing: -0.2,
    left: 33,
    position: "absolute",
  },createFlexBox: {
    textAlign: "center",
    letterSpacing: -0.2,
    width: 330,
  },  yourWallet: {
    top: 180,
    left: 126,
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  },  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily.interSemibold,
    fontWeight: "600",
    position: "absolute",
  }, rectangleParent: {
    top: 330,
    borderRadius: Border.br_sm,
    backgroundColor: '#CEF213',
    fontFamily: FontFamily.interSemibold,
  },rectangleLayout: {
    height: 60,
    width: 330,
    left: 33,
    position: "absolute",
  }, rectangleGroup: {
    top: 410,
    backgroundColor: Color.gray_200,
  },

})