import { MaterialIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  HStack,
  Icon,
  IconButton,
  Menu,
  Pressable,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { language as stateLanguage } from "../../../service/state";
import { signClient } from "../../../service/walletConnect";
import { deleteNotification, getAllNotifications } from "../../../store/setting";
import { PairingTypes } from '@walletconnect/types'

export default function Requests({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [requests, setRequests] = useState([] as any[]);
  const [paringMap, setParingMap] = useState({} as any);
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const { _requests, _pairingMap } = await getRequests(false);
      if (isMounted) {
        setRequests(_requests);
        setParingMap(_pairingMap);
      }
    }
    runAsync();
    return () => { isMounted = false }
  }, []);

  const getRequests = async (save: boolean) => {
    const _requests = await getAllNotifications();
    if (_requests) {
      const _pairings = signClient.core.pairing.getPairings();
      const _pairingMap = _pairings.reduce((returnVal: any, val: { topic: any; }, i: any) => {
        return { ...returnVal, [val.topic]: val };
      }, {})
      if (save) {
        setRequests(_requests);
        setParingMap(_pairingMap);
      }
      return { _requests, _pairingMap };
    }
    return { _requests: [], _pairingMap: {} };
  }

  const Request = ({ event, metadata }: { event: any, metadata: any }) => {
    //const address = metadata.wallet.address;
    const [isDeleted, setIsDeleted] = useState(false);

    const deleteRequest = () => {
      setIsDeleted(true);
      executeDelete();
    }

    const executeDelete = async () => {
      await deleteNotification(String(event.id));
      await getRequests(true);
    }

    const openRequest = async () => {
      //
    }

    const isExpired = () => {
      if (!metadata || !metadata.active) {
        return true;
      }
      return false;
    }

    if (isExpired()) {
      return (
        <Box display={isDeleted ? 'none' : 'flex'}>
          <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
            <HStack alignItems="center" space={{ base: 3, md: 6 }}>
              <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
                uri: metadata ? metadata?.peerMetadata?.icons[0] : 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
              }} />
              <VStack>
                <Text color={colorMode === 'dark' ? Color.white : Color.black}>{event.id}</Text>
                <Text color={'danger.500'}>{translations[language as keyof typeof translations].Requests.expired_text}</Text>
              </VStack>
            </HStack>
            <HStack alignItems="center" space={{ base: 2 }}>
              <IconButton onPress={deleteRequest}
                size={'md'} variant="ghost" colorScheme={colorMode === 'light' ? 'coolGray' : 'coolGray'} _icon={{
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
        <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }}>
            <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
              uri: metadata ? metadata.peerMetadata.icons[0] : 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
            }} />
            <VStack>
              <Text color={colorMode === 'dark' ? Color.white : Color.black}>{event.id}</Text>
              <Text color={'danger.500'}>{translations[language as keyof typeof translations].Requests.expired_text}</Text>
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
                <Menu.Item onPress={deleteRequest}><Text>{translations[language as keyof typeof translations].Requests.delete_button}</Text></Menu.Item>
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
              return (
                <Request event={val} metadata={mdt} key={'Request' + i} />
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