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
  KeyboardAvoidingView,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import {Platform, StyleSheet} from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { Network } from "../../service/network";
import { activeNetwork, activeWallet, selectedNetwork, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";
import { storeActiveNetwork, updateNetwork } from "../../store/network";

export default function ViewNetwork ({navigation, route}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [network, setNetwork] = useRecoilState(selectedNetwork);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  const [name, setName] = useState('');
  const [chainId, setChainId] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');
  const [blockExplorer, setExplorer] = useState('');
  const {colorMode} = useColorMode();

  const handleNameChange = (event) => {
    setName(event.nativeEvent.text)
  }
  const handleChainIdChange = (event) => {
    setChainId(event.nativeEvent.text)
  }
  const handleRpcUrlChange = (event) => {
    setRpcUrl(event.nativeEvent.text)
  }
  const handleSymbolChange = (event) => {
    setSymbol(event.nativeEvent.text)
  }
  const handleExplorerChange = (event) => {
    setExplorer(event.nativeEvent.text)
  }

  useEffect(() => {
    setName(network.name);
    setChainId(String(network.chainId));
    setRpcUrl(network.rpcUrl);
    setSymbol(network.symbol);
    setExplorer(network.blockExplorer);
  }, [network]);

  const _setActiveNetwork = async () => {
    setActiveNetwork(network);
    await updateNetwork(network);
  }

  const saveNetwork = () => {
    const runAsync = async () => {
      if (name.length > 0 && chainId !== '0' && rpcUrl.length > 0 && symbol.length > 0) {
        const _network = {
          blockExplorer,
          chainId: parseInt(chainId),
          name, 
          rpcUrl,
          symbol,
        };
        setActiveNetwork(_network);
        await updateNetwork(_network);
        //setNetwork(_network)
        //storeActiveNetwork(_network);
        setLoading(false);
        setIsEditing(false);
      } else {
        setLoading(false);
      }
    }

    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
  }

  return (
     <Center alignItems="center" flex={1} px="3">
 
        {!isEditing && 
          <KeyboardAvoidingView h={{
            base: "400px",
            lg: "auto"
          }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Box>
              <VStack space={4} px={2} py={4} >
                <Button onPress={() => {setIsEditing(true)}} ml={'auto'} px={8} colorScheme={colorMode === 'dark' ? 'primary': 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language].ViewNetwork.edit_button}</Text></Button>
                <Text fontSize={28} fontWeight={'bold'}>{network.name}</Text>
                <Text fontSize={20}>Chain Id: {network.chainId}</Text>
                <Text fontSize={16}>Symbol: {network.symbol}</Text>
                <Text fontSize={16}>RPC Url: {truncateString(network.rpcUrl, 30)}</Text>
              </VStack>        
              
              {_activeNetwork.chainId === network.chainId ?             
                <Alert maxW="400" status="info" colorScheme="info">
                  <Center>
                    <Text color={'black'} fontWeight={'bold'}>{translations[language].ViewNetwork.active_network} </Text>
                  </Center>              
                </Alert>
                : 
                <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
                  <Button onPress={() => {_setActiveNetwork();}} colorScheme={colorMode === 'dark' ? 'primary': 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language].ViewNetwork.use_network}</Text></Button>
                </Box>
              } 
              
            </Box>
          </KeyboardAvoidingView>
        }
        {isEditing && 
          <KeyboardAvoidingView h={{
            base: "400px",
            lg: "auto"
          }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Box>
              <VStack space={2} py={2} alignItems='center'>
                <Text style={styles.editTextMiddle} color={colorMode === 'dark' ? Color.white : Color.black} fontSize={'md'} fontWeight={'bold'}>{network.name}</Text>

                <Text style={styles.editTextTop} fontSize={'md'}  >Edit this network</Text>
              </VStack>
              <VStack space={2} px={2} alignItems='center'>
                <Input style={styles.textoImput} w="full" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].CreateNetwork.name_placeholder}  />
                <Input style={styles.textoImput} w="full" mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language].CreateNetwork.chainId_placeholder}  />
                <Input style={styles.textoImput} w="full" mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language].CreateNetwork.rpcUrl_placeholder}  />
                <Input style={styles.textoImput} w="full" mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language].CreateNetwork.symbol_placeholder}  />
                <Input  style={styles.textoImput}  w="full" mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language].CreateNetwork.explorer_placeholder}  />
              </VStack>        
                      
              <Box alignItems="center" marginBottom={20} w ={'full'}>
                <Button w={'full'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={saveNetwork} isLoading={loading}><Text color={colorMode === 'dark' ? Color.black : Color.white} fontWeight={'bold'}>{translations[language].CreateNetwork.button_save}</Text></Button>
                {/* <Button onPress={() => {setIsEditing(false)}} variant="outline"><Text>{'Cancel'}</Text></Button>   */}
              </Box>
            </Box>
          </KeyboardAvoidingView>
        }
        
      </Center>
  )
}



const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.black,
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    position: 'relative',
  }, 
  editTextMiddle: {
    marginLeft: 15, 
    marginRight: 15,
    textAlign: 'center', 
  },
  editTextTop: {
    color: Color.gray_100, 
    marginLeft: 15, 
    marginRight: 15,
    textAlign: 'center', 
  },
  textoImput: {
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  }
});