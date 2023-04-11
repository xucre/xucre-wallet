import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {StyleSheet} from 'react-native';
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
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
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

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
  const [network, ] = useRecoilState(selectedNetwork);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  const [name, setName] = useState('');
  const [chainId, setChainId] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');
  const [blockExplorer, setExplorer] = useState('');

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
    <DashboardLayout title={network.name}>
     <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
 
        {!isEditing && 
          <>
            <VStack space={4} px={2} py={4} height={'90%'}>
              <Button onPress={() => {setIsEditing(true)}} ml={'auto'} px={8}><Text>{translations[language].ViewNetwork.edit_button}</Text></Button>
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
              <Button onPress={() => {_setActiveNetwork();}}><Text>{translations[language].ViewNetwork.use_network}</Text></Button>
              </Box>
            } 
            
          </>
        }
        {isEditing && 
        
          <>
                 <Text style={{color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15}}fontSize={'md'} top={60} >Edit this network</Text>

<Text style={{color: '#fff', textAlign: 'center', marginLeft: 15, marginRight: 15}}fontSize={'md'} top={130} fontWeight={'bold'}>{network.name}</Text>

            <VStack space={4} px={2} py={150} height={'70%'} alignItems='center'>
              <Input  style={styles.textoImput} w="90%" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].CreateNetwork.name_placeholder}  />
              <Input style={styles.textoImput} w="90%" mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language].CreateNetwork.chainId_placeholder}  />
              <Input style={styles.textoImput} w="90%" mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language].CreateNetwork.rpcUrl_placeholder}  />
              <Input style={styles.textoImput} w="90%" mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language].CreateNetwork.symbol_placeholder}  />
              <Input  style={styles.textoImput}  w="90%" mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language].CreateNetwork.explorer_placeholder}  />
            </VStack>        
                     
            <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>
              <Button style={styles.buttonContainer} onPress={saveNetwork} isLoading={loading}><Text color={'#000'} fontWeight={'bold'}>{translations[language].CreateNetwork.button_save}</Text></Button>
              {/* <Button onPress={() => {setIsEditing(false)}} variant="outline"><Text>{'Cancel'}</Text></Button>   */}
            </Box>
          </>
        }
        
      </Box>
    </DashboardLayout>
  )
}



const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals, react-native/no-unused-styles
  buttonContainer: {
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#D4E815',
    position: 'relative',
    width: 370,

    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000',

  }, 
   // eslint-disable-next-line react-native/no-unused-styles
   groupParent: {
    top: 100,
    // eslint-disable-next-line sort-keys
    left: 22,
    width: 346,
    // eslint-disable-next-line sort-keys
    height: 56,
    position: "relative",
   }, rectangleParent: {
    left: 7,
    position: "absolute",
  // eslint-disable-next-line sort-keys
  }, groupWrapperLayout: {
    width: 339,
    // eslint-disable-next-line sort-keys
    top: 0,
    // eslint-disable-next-line sort-keys
    height: 56,
  // eslint-disable-next-line sort-keys
  }, titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.interRegular,
    textAlign: "center",
    top: 50,
  },ethereumTestnet: {
    top: 1,
    left: 18,
    width: 300,
    color: Color.white,
    letterSpacing: -0.2,
    fontFamily: FontFamily.interRegular,
    lineHeight: 21,
    fontSize: FontSize.size_base,
    textAlign: "left",
    position: "absolute"
  // eslint-disable-next-line react-native/no-color-literals
  }, textoImput: {
    borderRadius: Border.br_xs,
    backgroundColor: Color.gray_300,
    borderColor: "#7b7b7b",
    borderWidth: 1,
    borderStyle: "solid",
    width: 339,
    top: 0,
  }
});