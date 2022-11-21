import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  ColorMode,
  Divider,
  Drawer,
  Hidden,
  HStack,
  IconButton,
  Icon as IconElement,
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
import React, {createRef, useEffect, useState} from "react";
import { RefreshControl } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import NftCard from "../../components/nft/NftCard";
import TokenItem from '../../components/token/TokenItem';
import TransactionItem from "../../components/transaction/TransactionItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getNfts } from "../../service/blockdaemon";
import { activeNetwork, activeWallet, AppWallet, networkList, language as stateLanguage } from "../../service/state";
import { truncateString } from "../../service/utility";
import { getActiveWallet } from "../../store/wallet";

export default function NftList ({navigation, route}) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [chain, setChain] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [wallet, setActiveWallet] = useState({
    name: '',
    wallet: {}
  } as AppWallet);
  const [holdings, setHoldings] = useState([]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);
  
  const syncNfts = async () => {
    if (wallet.name.length > 0) {
      //console.log(wallet);
      const _tokens = await getNfts(wallet.wallet.address);
      //console.log(_tokens);
      if (isComponentMounted) {
        setChain(_tokens.chain);
        setHoldings(_tokens.results);
        setRefreshing(false);
      }
    }
    
  }

  useEffect(() => {    
    //setHoldings([]);
    setTimeout(() => {
      if (wallet.name.length > 0 ) {
        syncNfts();
      }      
    }, 1000)
  }, [wallet])

  useEffect(() => {
    const runAsync = async () => {
      console.log('getActiveWallet2');
      const _wallet = await getActiveWallet();
      //console.log(_wallet[0]);
      setActiveWallet(_wallet[0]);
    }
    
    runAsync();
  }, [])


  const onRefresh = React.useCallback(async () => {
    console.log('refreshing nfts');
    setRefreshing(true);
    setTimeout(() => {
      syncNfts();
    }, 1000)
  }, []);
  
  const addToken = () => {
    navigation.navigate('AddToken');
  }

  return (
    <DashboardLayout title={wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
        safeAreaBottom
      >
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}              
            />
          }
        >
          <VStack space="5" px={2} mb={10}>
            {wallet.name.length > 0 && wallet.wallet.address !== '' &&
              <Box m={6} >
                <VStack space={2} >
                  {
                    holdings.map((nft, i) => {
                      return (                        
                        <NftCard key={nft.contract_address+nft.id+i} token={nft.id} contract={nft.contract_address} chain={chain}/>                        
                      )
                    })
                  }
                </VStack>
                
                
                
              </Box>
            }
          </VStack>
        </ScrollView>
      </Box>
    </DashboardLayout>
  )
}