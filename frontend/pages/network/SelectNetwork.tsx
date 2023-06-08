/* eslint-disable react-native/no-unused-styles */
/* eslint-disable sort-keys */
/* eslint-disable import/order */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons'; 
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { position } from "native-base/lib/typescript/theme/styled-system";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";

import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
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
  View,
  VStack,
} from "native-base";
import {StyleSheet} from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";
import { getIconImage } from "../../service/api";
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
  const { colorMode } = useColorMode();
  const [, setSelectedNetwork] = useRecoilState(selectedNetwork);
  const [networks, setNetworks] = useRecoilState(networkList);
  const [, setActiveNetwork] = useRecoilState(activeNetwork);
  const [tokenImage, setTokenImage] = useState('');
  useEffect(() => {
    const runAsync = async () => {
      const _networks = await getNetworks();
      console.log('nectworks ', _networks)
      if (Array.isArray(_networks)) {
        setNetworks(_networks);
      }
    }
    runAsync();
  }, [tokenImage])

  const createNetwork = () => {
    navigation.navigate('CreateNetwork');
  }

  const viewNetwork = () => {
    navigation.navigate('ViewNetwork');
  }

  const getIconNetwork = async (metadata: any) => {
    try {
      const img = await getIconImage(metadata.symbol.toLowerCase());
        console.log('data1', img)
        return img
    } catch (err) {
        console.log(err)
    }

}

  const NetworkItem = ({metadata}) => {
    
      const avatarNetwork = getIconNetwork(metadata)
      console.log('avatarNetworks', avatarNetwork)

    console.log('paso4', metadata)
    const selectNetwork= () => {
      setActiveNetwork(metadata);
      storeActiveNetwork(metadata);
      //viewNetwork();
    }

    const openNetwork = () => {
      setSelectedNetwork(metadata);
      viewNetwork();
    }

    const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/'+metadata.symbol.toLowerCase()+'.png'

    const isDark = colorMode === 'dark';
    return (
      <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'} flex={3}>
      <HStack alignItems="center" justifyContent="space-between">
        <View style={styles.groupParent}>
        <Pressable onPress={openNetwork}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }} >
            <VStack space={1}>
                  <View style={[styles.rectangleParent, styles.groupWrapperLayout]}>
                    <View style={[
                            styles.groupChild,
                            styles.groupLayout,
                            styles.networksBorder,
                          ]}>
                      <Text  style={[
                            styles.ethereum,
                            styles.ethereumLayout,
                            styles.ethereumLayout1,
                          ]} >
                       {metadata.name}
                      </Text>
                    </View>
                </View>
            </VStack>
            {/* <View>
            <Text style={styles.textContainer}>{metadata.chainId}</Text> 
            </View> */}
            

          </HStack>
        </Pressable>
        <HStack alignItems="center" space={{ base: 2 }}>       
          <Tooltip label={translations[language].SelectNetwork.select_button_tooltip} openDelay={500}>
            <Menu w="190" trigger={triggerProps => {
              return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                {

                  <Avatar bg={isDark ? 'coolGray.800' : 'coolGray.300'} size="md" ml="10px" mb="10px" mr="1" source={{
                    uri: avatar
                  }}>
                  </Avatar>
                }
              </Pressable>;
              }}
            >                
              <Menu.Item onPress={() => {selectNetwork()}}><Text>{translations[language].SelectNetwork.select_button}</Text></Menu.Item>                
            </Menu>
          </Tooltip>
          
        </HStack>
        </View>
      </HStack>
      </Box>
    )
  }

  return (
    <GuestLayout >

      <Box         
         _light={{ backgroundColor: Color.gray_300 }}
        _dark={{ backgroundColor: Color.gray_300 }}
        height={'100%'}
        width={'100%'}
        top={-50}
      >
        
<Text style={{color: '#fff', textAlign: 'center', marginLeft: 15, marginRight: 15}} fontSize={'md'} top={60} fontWeight={'bold'}>{translations[language].SelectNetwork.title}</Text>
<Text style={{color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15}} fontSize={15} top={70} >{translations[language].SelectNetwork.select_network}</Text>

        <VStack space={2} height={'50%'}>
          {
            networks.map((val, i) => {
              return (
                <Box key={val.name+i} px={4} py={1} top={10} >
                  <NetworkItem metadata={val} /> 
                </Box>
              )              
            })
          }
        </VStack>
        <Box alignItems="center" marginBottom={20} marginTop={10} h={'full'} w ={'full'} >
        <Button style={styles.buttoContainer} onPress={createNetwork}><Text style={{color: '#fff'}}>{translations[language].SelectNetwork.new_button}</Text></Button>
        </Box>
      </Box>
    </GuestLayout>
  )
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals, react-native/no-unused-styles
  buttoContainer: {
    fontWeight: 'bold',
    backgroundColor: Color.gray_200,
    position: 'absolute',
    width: 325,
    textAlign: 'left',
    borderRadius: Border.br_sm,
    fontFamily: FontFamily.interRegular,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000'

  }, 
  groupParent: {
    top: 100,
    width: 346,
    height: 56,
    position: "relative",
  },  rectangleParent: {
    left: 7,
    position: "absolute",

  },  groupWrapperLayout: {
    width: 339,
    
    top: 0,

    height: 56,

  },  groupChild: {
    borderColor: "#858585",
  }, groupLayout: {
    backgroundColor: Color.gray_200,
    borderRadius: Border.br_sm,
    left: 0,
    width: 339,

    top: 0,

    height: 56,
    position: "absolute",
  },  networksBorder: {
    borderWidth: 1,
    
    borderStyle: "solid",

  },  ethereum: {
    top: 16,
    left: 60,
  },  ethereumLayout1: {
    width: 234,

    height: 27,
    textAlign: "left",

    color: Color.white,
    fontFamily: FontFamily.interRegular,
    lineHeight: 21,

    letterSpacing: -0.2,

    fontSize: FontSize.size_base,
  },

  networksInner: {
    top: 437,
  },
  newNetwork: {
    top: 17,

    left: 21,
  }, networksPosition: {
    left: 29,
    width: 339,

    height: 56,
    position: "absolute",

  }, ethereumLayout: {
    height: 27,
    position: "absolute",
  }, 
  network: {
    top: 112,
    left: 152,
    fontSize: FontSize.size_2xl,
    lineHeight: 30,
    fontWeight: "600",
    fontFamily: FontFamily.interSemibold,
    textAlign: "left",
    color: Color.white,
    letterSpacing: -0.2,
    position: "absolute",
  }
});