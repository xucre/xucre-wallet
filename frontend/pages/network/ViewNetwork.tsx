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
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        {!isEditing && 
          <>
            <VStack space={4} px={2} py={4} height={'90%'}>
              <Button onPress={() => {setIsEditing(true)}} ml={'auto'} px={8}><Text>{'Edit'}</Text></Button>
              <Text fontSize={28} fontWeight={'bold'}>{network.name}</Text>
              <Text fontSize={20}>Chain Id: {network.chainId}</Text>
              <Text fontSize={16}>Symbol: {network.symbol}</Text>
              <Text fontSize={16}>RPC Url: {truncateString(network.rpcUrl, 30)}</Text>
            </VStack>        
            
            {_activeNetwork.chainId === network.chainId ?             
              <Alert maxW="400" status="info" colorScheme="info">
                <Center>
                  <Text color={'black'} fontWeight={'bold'}>Network Active</Text>
                </Center>              
              </Alert>
              : 
              <Button onPress={() => {_setActiveNetwork();}}><Text>{'Use Network'}</Text></Button>
            } 
            
          </>
        }
        {isEditing && 
          <>
            <VStack space={4} px={2} py={4} height={'90%'}>
              <Input w="100%" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].CreateNetwork.name_placeholder}  />
              <Input w="100%" mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language].CreateNetwork.chainId_placeholder}  />
              <Input w="100%" mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language].CreateNetwork.rpcUrl_placeholder}  />
              <Input w="100%" mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language].CreateNetwork.symbol_placeholder}  />
              <Input w="100%" mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language].CreateNetwork.explorer_placeholder}  />
            </VStack>        
            
            <Button.Group isAttached colorScheme="blue" mx={{
                base: "auto",
                md: 0
              }} size="sm">          
              <Button onPress={saveNetwork} isLoading={loading}><Text>{'Save'}</Text></Button>
              <Button onPress={() => {setIsEditing(false)}} variant="outline"><Text>{'Cancel'}</Text></Button>  
            </Button.Group>
          </>
        }
        
      </Box>
    </DashboardLayout>
  )
}