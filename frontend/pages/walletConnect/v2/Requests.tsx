import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import {
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Drawer,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
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
import React, {useEffect, useState} from "react";
import Svg, { Circle } from "react-native-svg";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { language as stateLanguage, walletList } from "../../../service/state";
import { truncateString, truncateStringStart } from "../../../service/utility";
import { signClient } from "../../../service/walletConnect";
import { deleteNotification, getAllNotifications } from "../../../store/setting";

export default function Requests({navigation, route}) {
  const [requests, setRequests] = useState([]);
  const [paringMap, setParingMap] = useState({});
  const [language, ] = useRecoilState(stateLanguage);
  const {colorMode} = useColorMode();
  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    const _requests = await getAllNotifications();
    //console.log(_requests);
    if (_requests) {
      const _pairings = signClient.core.pairing.getPairings();
      const _pairingMap = _pairings.reduce((returnVal, val, i) => {
        return {...returnVal, [val.topic] : val};
      }, {})
      setRequests(_requests);
      setParingMap(_pairingMap);
    }
    
  }

  const Request = ({event, metadata}) => {
    //const address = metadata.wallet.address;
    const [isDeleted, setIsDeleted] = useState(false);
    useEffect(() => {
      const runAsync = async () => {
        //console.log('run async', metadata.topic);
        //const res = await signClient.core.pairing.ping({ topic: metadata.topic })
        //console.log('ping pair', res);
      }
      runAsync();
      //console.log('pairdata', metadata);
      console.log(event);
    }, [metadata, event])

    const deleteRequest = () => {
      setIsDeleted(true);
      executeDelete();
    }

    const executeDelete= async () => {
      await deleteNotification(String(event.id));
      await getRequests();
    }

    const openRequest = async () => {
      //
    }

    const isExpired = () => {
      if (!metadata) {
        return true;
      }
      return false;
    } 

    if (isExpired()) {
      return (
        <Box display={isDeleted ? 'none' : 'flex'}>
          <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>                
            <HStack alignItems="center" space={{ base: 3, md: 6 }}>
              <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
                uri: metadata ? metadata.peerMetadata.icons[0] : 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
              }} />
              <VStack>
                <Text color={colorMode === 'dark' ? Color.white : Color.black}>{event.id}</Text>
                <Text color={'danger.500'}>{translations[language].Requests.expired_text}</Text>
              </VStack>
            </HStack>
            <HStack alignItems="center" space={{ base: 2 }}> 
              <IconButton onPress={deleteRequest} 
                size={'md'} variant="ghost" colorScheme={colorMode === 'light'? 'coolGray': 'coolGray'} _icon={{
                as: MaterialIcons,
                name: "close"
              }} />
            </HStack>
          </HStack>
        </Box>
        
      )
    }

    return (
      <Box display={isDeleted ? 'none' : 'flex'}>
        <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>                
          <HStack alignItems="center" space={{ base: 3, md: 6 }}>
            <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
              uri: metadata ? metadata.peerMetadata.icons[0] : 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
            }} />
            <VStack>
              <Text color={colorMode === 'dark' ? Color.white : Color.black}>{event.id}</Text>
              <Text color={'danger.500'}>{translations[language].Requests.expired_text}</Text>
            </VStack>
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
                <Menu.Item onPress={deleteRequest}><Text>{translations[language].Requests.delete_button}</Text></Menu.Item>              
              </Menu>
            </Tooltip>    
          </HStack>
        </HStack>
      </Box>
    )
  }

  return (
    <GuestLayout>
      <ScrollView>
        
          <VStack space={5} py={4} w={'full'}>
            {
              requests.map((val, i) => {
                const mdt = paringMap[val.topic];
                //if (i === 0) console.log(paringMap['cad4d704a30a324806b2aaedb6e95e58fde39dbe0e3c061729935d06462a443c']);
                return (
                    <Request event={val} metadata={mdt} key={'Request'+i} />                 
                )              
              })
            }
          </VStack>
      </ScrollView>
    </GuestLayout>
  );
}

/*

{/*<HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
  <HStack alignItems="center" space={{ base: 3, md: 6 }}>
    <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
      uri: metadata.peerMetadata.icons[0] || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
    }} />
    <VStack>
      <Text color={colorMode === 'dark' ? Color.white : Color.black}>{metadata.peerMetadata.name}</Text>
      <Text color={'gray.500'}>{truncateStringStart(metadata.topic, 25)}</Text>
    </VStack>
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
          <Menu.Item onPress={() => {removePair()}}><Text>{translations[language].Connections.delete_button}</Text></Menu.Item>                
        </Menu>
      </Tooltip>    
</HStack>
</HStack>*/