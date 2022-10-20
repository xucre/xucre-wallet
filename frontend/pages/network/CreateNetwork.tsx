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
    <ScrollView w={'full'} h={'full'} marginTop={5}>
      <>
        <Box alignItems="center" marginBottom={3}>
          <Input w="100%" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].CreateNetwork.name_placeholder}  />
          <Input w="100%" mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language].CreateNetwork.chainId_placeholder}  />
          <Input w="100%" mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language].CreateNetwork.rpcUrl_placeholder}  />
          <Input w="100%" mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language].CreateNetwork.symbol_placeholder}  />
          <Input w="100%" mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language].CreateNetwork.explorer_placeholder}  />
        </Box>
        <Button onPress={() => {saveNetwork();}} isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || rpcUrl.length === 0 || symbol.length === 0}><Text>{translations[language].CreateNetwork.submit_button}</Text></Button>
      </>
    </ScrollView>
  );
}
