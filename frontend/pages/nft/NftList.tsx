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

import { Color } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import NftCard from "../../components/nft/NftCard";
import NftItemLarge from "../../components/nft/NftItemLarge";
import NftItemSmall from "../../components/nft/NftItemSmall";
import NftListItem from "../../components/nft/NftListItem";
import TokenItem from '../../components/token/TokenItem';
import TransactionItem from "../../components/transaction/TransactionItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getNftJson } from "../../service/api";
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
  //const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [holdings, setHoldings] = useState([]);
  const [trending, setTrending] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);
  
  const syncNfts = async () => {
    try {
      if (wallet.name.length > 0) {
        //console.log(wallet);
        const _tokens = await getNfts(wallet.wallet.address);
        const nftJson = await getNftJson();
        //console.log(nftJson.collections);
        if (isComponentMounted) {
          setChain(_tokens.chain);
          setHoldings(_tokens.results);
          setTrending(nftJson.trending);
          setCollections(nftJson.collections);
          setRefreshing(false);
        }
      }
    } catch (err) {
      console.log(err);
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
      //console.log('getActiveWallet2');
      const _wallet = await getActiveWallet();
      //console.log(_wallet[0]);
      setActiveWallet(_wallet[0]);
    }
    
    runAsync();
  }, [])


  const onRefresh = React.useCallback(async () => {
   //console.log('refreshing nfts');
    //setRefreshing(true);
    /*setTimeout(() => {
      syncNfts();
    }, 1000)*/
  }, []);
  
  const addToken = () => {
    navigation.navigate('AddToken');
  }

  return (
    <Box         
      _light={{ backgroundColor: Color.white }}
      _dark={{ backgroundColor: Color.black }}
      height={'100%'}
      safeAreaBottom
    >
      
        {wallet.name.length > 0 && wallet.wallet.address !== '' && 
          <ScrollView 
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}              
              />
            }
            mb={20}
          >
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.100' }}
              fontSize="md"
              fontWeight="medium"
              m={2}
            >Trending</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={1} mb={2} mx={3}>
                {
                  trending.map((nft, i) => {
                    return (                                   
                      <NftItemLarge key={nft.key+i} item={nft}/>                        
                    )
                  })              
                }
              </HStack>
            </ScrollView>
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.100' }}
              fontSize="md"
              fontWeight="medium"
              m={2}
            >Collections</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={0} mx={3} >
                {
                  collections.map((nft, i) => {
                    return (                                   
                      <NftItemSmall key={nft.key+i} item={nft}/>                        
                    )
                  })              
                }
              </HStack>
            </ScrollView>
            
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.100' }}
              fontSize="md"
              fontWeight="medium"
              p={0}
              m={2}
              mt={0}
            >Your List</Text>
            <VStack space="2" px={0} mb={10} mx={3}>
              {
                <Box m={0} >
                  <VStack space={1} >
                    {
                      holdings.map((nft, i) => {
                        return ( 
                          <NftListItem key={nft.contract_address+nft.id+i} token={nft.id} contract={nft.contract_address} chain={chain}/>
                        )
                      })
                    }
                  </VStack>
                </Box>
              }
            </VStack>
          </ScrollView>
        }
        
        <MobileFooter wallet={wallet} navigation={navigation}></MobileFooter>
    </Box>
  )
}