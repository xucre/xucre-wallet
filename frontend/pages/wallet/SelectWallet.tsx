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
import { activeWallet, language as stateLanguage, walletList } from "../../service/state";
import { truncateString } from "../../service/utility";
import { getWallets, storeActiveWallet } from "../../store/wallet";

export default function SelectWallet ({navigation, route}) {
  const {
    colorMode
  } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [walletState, setWalletState] = useRecoilState(walletList);
  const [, setActiveWallet] = useRecoilState(activeWallet);
  
  const createWallet = () => {
    navigation.navigate('NewWallet');
  }

  const viewWallet = () => {
    navigation.navigate('ViewWallet');
  }

  const WalletItem = ({metadata}) => {
    const selectWallet = () => {
      setActiveWallet(metadata);   
      storeActiveWallet(metadata);  
    }

    const openWallet = () => {      
      setActiveWallet(metadata);   
      storeActiveWallet(metadata);
      viewWallet();
    }
    return (
      <HStack alignItems="center" justifyContent="space-between">
        
        <Pressable onPress={openWallet}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }}>
            <VStack space={1}>
                <Text fontSize="md" bold>
                  {metadata.name}
                </Text>
            </VStack>
            
            <Text color="coolGray.500">{truncateString(metadata.wallet.address, 20)}</Text>     
          </HStack>
        </Pressable>
        <HStack alignItems="center" space={{ base: 2 }}>       
          <Tooltip label={translations[language].SelectWallet.select_button_tooltip} openDelay={500}>
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
              <Menu.Item onPress={() => {selectWallet()}}><Text>{translations[language].SelectWallet.select_button}</Text></Menu.Item>                
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
            walletState.map((val, i) => {
              return (
                <Box key={val.name+i} px={4} py={1}>
                  <WalletItem metadata={val} /> 
                  {(i+1) !== walletState.length && 
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
        
        <Button onPress={createWallet} colorScheme={colorMode === 'dark' ? 'primary': 'tertiary'}><Text color={colorMode === 'dark' ? 'darkText' : 'lightText'}>{translations[language].SelectWallet.new_button}</Text></Button>
      </Box>
    </GuestLayout>
  )
}