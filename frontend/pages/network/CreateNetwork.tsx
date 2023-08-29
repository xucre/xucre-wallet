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
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  View,
  VStack,
} from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import {Platform, StyleSheet} from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { constructDefaultNetworks, Network } from "../../service/network";
import { activeNetwork, language, networkList, language as stateLanguage, walletList } from "../../service/state";
import { getActiveNetwork, getNetworks, storeActiveNetwork, storeNetwork, } from "../../store/network";


export default function CreateWallet ({navigation, route, storage}) {
  const [networks, setNetworks] = useRecoilState(networkList);
  const [language, ] = useRecoilState(stateLanguage);
  const [loading, setLoading] = useState(false);
  const [blockExplorer, setBlockExplorer] = useState('');
  const [chainId, setChainId] = useState('');
  const [name, setName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const {
    colorMode
  } = useColorMode();
  const icon_color = colorMode ==='dark'? 'white':'black';

  const handleNameChange = (event) => {
    //console.log(event.nativeEvent.text);
    setName(event.nativeEvent.text)
  }
  const handleExplorerChange = (event) => {
    //console.log(event.nativeEvent.text);
    setBlockExplorer(event.nativeEvent.text)
  }
  const handleChainIdChange = (event) => {
    //console.log(event.nativeEvent.text);
    setChainId(event.nativeEvent.text);
  }
  const handleRpcUrlChange = (event) => {
    //console.log(event.nativeEvent.text);
    setRpcUrl(event.nativeEvent.text)
  }
  const handleSymbolChange = (event) => {
    //console.log(event.nativeEvent.text);
    setSymbol(event.nativeEvent.text)
  }


  const saveNetwork = () => {
    const runAsync = async () => {
      if (name.length > 0 && chainId.length > 0 && rpcUrl.length > 0 && symbol.length > 0 && Number.isInteger(Number.parseInt(chainId))) {
        //console.log(_wallet.privateKey, name);
        const _network : Network = {
          blockExplorer,
          chainId : Number.parseInt(chainId),
          name,
          rpcUrl,
          symbol,
        };
        await storeNetwork(_network);
        setNetworks([
          networks,
          _network
        ]);
        setLoading(false);
        setTimeout(() => {
          navigation.navigate('SelectNetwork');
        }, 100);
        
      } else {
        setLoading(false);
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
            <VStack minW="300px" w="full" alignItems="center" flex="1" justifyContent={'center'} marginBottom={20} marginTop={20}>
              <Heading mb={5} style={styles.titleLayout} fontWeight={'normal'}><Text color={colorMode === 'dark' ? Color.white : Color.black}>New Network</Text></Heading>
              <Input style={styles.textoImput} mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].CreateNetwork.name_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language].CreateNetwork.chainId_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language].CreateNetwork.rpcUrl_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language].CreateNetwork.symbol_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language].CreateNetwork.explorer_placeholder}  />
              <Button.Group>
                <Button w={'100%'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveNetwork();}} isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || rpcUrl.length === 0 || symbol.length === 0}>
                  <Text fontWeight={'bold'} style={{color: colorMode === 'dark' ? Color.black : Color.white}}>{translations[language].CreateNetwork.submit_button}</Text>
                </Button>
              </Button.Group>
              
            </VStack>
              
          </KeyboardAvoidingView>
        </Center>
  );
}

const styles = StyleSheet.create({
  textoImput: {
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  },
    titleLayout: {
      color: Color.black,
      fontFamily: FontFamily.inter,
      fontSize: 30,
      textAlign: "center",
    },
});