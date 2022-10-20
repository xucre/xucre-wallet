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
import GuestLayout from '../../layouts/GuestLayout';
import { 
  activeNetwork, 
  networkList,
  selectedNetwork,
  language as stateLanguage,
} from "../../service/state";
import { truncateString } from "../../service/utility";
import { getNetworks, storeActiveNetwork } from "../../store/network";

export default function SelectNetwork ({navigation, route}) {
  const [language,] = useRecoilState(stateLanguage);
  const [, setSelectedNetwork] = useRecoilState(selectedNetwork);
  const [networks, setNetworks] = useRecoilState(networkList);
  const [, setActiveNetwork] = useRecoilState(activeNetwork);
  useEffect(() => {
    const runAsync = async () => {
      const _networks = await getNetworks();
      if (Array.isArray(_networks)) {
        setNetworks(_networks);
      }
    }
    runAsync();
  }, [])

  const createNetwork = () => {
    navigation.navigate('CreateNetwork');
  }

  const viewNetwork = () => {
    navigation.navigate('ViewNetwork');
  }

  const NetworkItem = ({metadata}) => {
    const selectNetwork= () => {
      //
      //console.log(metadata);
      setActiveNetwork(metadata);
      storeActiveNetwork(metadata);
      //viewNetwork();
    }

    const openNetwork = () => {
      setSelectedNetwork(metadata);
      viewNetwork();
    }
    return (
      <HStack alignItems="center" justifyContent="space-between">
        
        <Pressable onPress={openNetwork}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }}>
            <VStack space={1}>
                <Text fontSize="md" bold>
                  {metadata.name}
                </Text>
            </VStack>
            
            <Text color="coolGray.500">{metadata.chainId}</Text>     
          </HStack>
        </Pressable>
        <HStack alignItems="center" space={{ base: 2 }}>       
          <Tooltip label={translations[language].SelectNetwork.select_button_tooltip} openDelay={500}>
            <Menu w="190" trigger={triggerProps => {
              return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <Icon
                  as={MaterialIcons}
                  name="more-vert"
                  size="6"
                  color="coolGray.500"
                />
              </Pressable>;
              }}
            >                
              <Menu.Item onPress={() => {selectNetwork()}}><Text>{translations[language].SelectNetwork.select_button}</Text></Menu.Item>                
            </Menu>
          </Tooltip>
          
        </HStack>
      </HStack>
    )
  }

  return (
    <GuestLayout>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        <VStack space={4} height={'90%'}>
          {
            networks.map((val, i) => {
              return (
                <Box key={val.name+i} px={4} py={1}>
                  <NetworkItem metadata={val} /> 
                  {(i+1) !== networks.length && 
                    <Divider orientation={'horizontal'} mt={4} _light={{
                      bg: "muted.800"
                    }} _dark={{
                      bg: "muted.300"
                    }} />
                  }
                  
                </Box>
              )              
            })
          }
        </VStack>
        
        <Button onPress={createNetwork}><Text>{translations[language].SelectNetwork.new_button}</Text></Button>
      </Box>
    </GuestLayout>
  )
}