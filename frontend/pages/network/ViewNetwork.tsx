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
import { activeWallet, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
          }}
          _dark={{
            color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            borderTopLeftRadius="sm"
            borderTopRightRadius="sm"
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            h="1"
          />
        )}
      </VStack>
    </Pressable>
  );
}

export default function ViewWallet ({navigation, route}) {
  const [language,] = useRecoilState(stateLanguage);
  const [currentTab, setCurrentTab] = useState(translations[language].ViewWallet.tab_list[0]);
  const [wallet, setActiveWallet] = useRecoilState(activeWallet);
  const tabList = translations[language].ViewWallet.tab_list;

  useEffect(() => {
    if (wallet.name === '') {
      navigation.navigate('SelectWallet');
    }
  }, [activeWallet]);

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  }

  const viewWallet = () => {
    navigation.navigate('ViewWallet');
  }

  const WalletItem = ({metadata}) => {
    const selectWallet = () => {
      //
      
    }
    return (
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <VStack space={1}>
            <Pressable>
              <Text fontSize="md" bold>
                {metadata.name}
              </Text>
            </Pressable>
          </VStack>
          
          <Text color="coolGray.500">{truncateString(metadata.wallet.address, 20)}</Text>     
        </HStack>
        <HStack alignItems="center" space={{ base: 2 }}>       
          <Tooltip label="More Options" openDelay={500}>
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
              <Menu.Item onPress={() => {selectWallet()}}><Text>Select Wallet</Text></Menu.Item>                
            </Menu>
          </Tooltip>
          
        </HStack>
      </HStack>
    )
  }

  return (
    <DashboardLayout title={wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        <VStack space={4}>
          <Text>{wallet.name}</Text>
          <Text>{wallet.wallet.address}</Text>
        </VStack>
        <HStack
          mt={5}
          _light={{
            bg: 'coolGray.100',
          }}
          _dark={{
            bg: 'coolGray.700',
          }}
          w="100%"
          justifyContent="space-around"
          borderRadius="sm"
        >
          {
            tabList.map((tab, index) => {
              return (
                <TabItem key={index} tabName={tab} currentTab={currentTab} handleTabChange={handleTabChange} />
              )
            })
          }
        </HStack>
        
        <VStack space="5" px={2}>
          {currentTab == translations[language].ViewWallet.tab_list[0] &&
            <Center m={6}>
              <Text>{translations[language].ViewWallet.holdings_placeholder}</Text>
            </Center>
          }

          {currentTab == translations[language].ViewWallet.tab_list[1] &&
            <Center m={6}>
              <Text>{translations[language].ViewWallet.transactions_placeholder}</Text>
            </Center>
          }
        </VStack>
        
      </Box>
    </DashboardLayout>
  )
}