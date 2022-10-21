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
import { activeWallet, selectedNetwork, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";

export default function ViewNetwork ({navigation, route}) {
  const [language,] = useRecoilState(stateLanguage);
  const [network, ] = useRecoilState(selectedNetwork);

  useEffect(() => {
    //
  }, [activeWallet]);

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
            
            {activeNetwork.chainId === network.chainId ?             
              <Alert maxW="400" status="info" colorScheme="info">
                <Center>
                  <Text color={'black'} fontWeight={'bold'}>Network Active</Text>
                </Center>              
              </Alert>
              : 
              <Button onPress={() => {setActiveNetwork(network);}}><Text>{'Use Network'}</Text></Button>
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