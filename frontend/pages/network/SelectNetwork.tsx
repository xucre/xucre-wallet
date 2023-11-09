/* eslint-disable sort-keys */
/* eslint-disable import/order */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import { Color } from "../../../GlobalStyles";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  Pressable,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
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
import { deleteNetwork, getNetworks, storeActiveNetwork } from "../../store/network";
import { Network } from "../../service/network";

export default function SelectNetwork ({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [, setSelectedNetwork] = useRecoilState(selectedNetwork);
  const [networks, setNetworks] = useRecoilState(networkList);
  const [, setActiveNetwork] = useRecoilState(activeNetwork);
  const [tokenImage, setTokenImage] = useState('');
  useEffect(() => {
    const runAsync = async () => {
      const _networks = await getNetworks();
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
      if (metadata && metadata.symbol) {
        const img = await getIconImage(metadata.symbol.toLowerCase());
        return img
      }
      
    } catch (err) {
        //
    }

}

  const NetworkItem = ({metadata}: {metadata: Network}) => {
    const selectNetwork= () => {
      setActiveNetwork(metadata);
      storeActiveNetwork(metadata);
      //viewNetwork();
    }

    const openNetwork = () => {
      setSelectedNetwork(metadata);
      viewNetwork();
    }

    const removeNetwork = async () => {
      const result = await deleteNetwork(metadata);
      const _networks = await getNetworks();
      if (Array.isArray(_networks)) {
        setNetworks(_networks);
      } else {
        setNetworks([]);
      }
    }

    const [avatar, setAvatar] = useState('');
    useEffect(() => {
      if (metadata && metadata.symbol) {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/'+metadata.symbol.toLowerCase()+'.png');
      } else {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png');
      }
    }, [metadata])

    return (
      <HStack alignItems="center" justifyContent="space-between" pr={3} py={1} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
        <Pressable onPress={() => {openNetwork()}}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" ml="10px" mb="10px" mr="1" mt="4px" source={{
            uri: avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
          }} />
          <Text fontSize="md" bold>
            {metadata.name}
          </Text>
        </HStack>
        </Pressable>
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
                <Menu.Item onPress={() => {selectNetwork()}}><Text>{translations[language as keyof typeof translations].SelectNetwork.select_button}</Text></Menu.Item>
                  <Menu.Item onPress={() => {removeNetwork()}}><Text>{translations[language as keyof typeof translations].SelectNetwork.delete_button}</Text></Menu.Item> 
                              
              </Menu>
            </Tooltip>    
        </HStack>
      </HStack>
    )
  }

  return (
    <GuestLayout >

    <ScrollView height={'full'}>
      <Box         
         _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        
        width={'100%'}
      >
          <Text style={{color: colorMode === 'dark' ? Color.white : Color.black, textAlign: 'center', marginLeft: 15, marginRight: 15}} fontSize={'md'} fontWeight={'bold'}>{translations[language as keyof typeof translations].SelectNetwork.title}</Text>
          <Text style={{color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15}} fontSize={15} >{translations[language as keyof typeof translations].SelectNetwork.select_network}</Text>

          <VStack space={3} py={4}>
            {
              networks.map((val, i) => {
                return (
                  <Box key={val.name+i} px={4} py={0} >
                    <NetworkItem metadata={val} /> 
                  </Box>
                )              
              })
            }
            <Button mx={5} width={'90%'} style={{ borderRadius: 100}} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={createNetwork}>
              <Text style={{color: colorMode === 'dark' ? '#fff' : '#fff'}}>{translations[language as keyof typeof translations].SelectNetwork.new_button}</Text>
            </Button>
          </VStack>
            
        </Box>
      </ScrollView>
    </GuestLayout>
  )
}
