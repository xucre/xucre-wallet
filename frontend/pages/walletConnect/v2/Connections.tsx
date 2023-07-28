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

export default function ConnectionRequest({navigation, route}) {
  const [request, setRequest] = useState({});
  const [pairings, setPairings] = useState([]);
  const [selectedPairing, setSelectedPairing] = useState({});
  const [language, ] = useRecoilState(stateLanguage);
  const {colorMode} = useColorMode();
  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    getPairs();
  }, []);

  const getPairs = async () => {
    const _pairings = signClient.core.pairing.getPairings();
    //console.log(pairings, 'pairings')
    setPairings(_pairings);
  }

  const WalletItem = ({metadata}) => {
    const address = metadata.wallet.address;
    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
          
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Text fontSize="md" bold>
            {metadata.name}
          </Text>
          <Text color="coolGray.500">{truncateString(metadata.wallet.address, 25)}</Text>
        </HStack>
      </HStack>
    )
  }

  const Pair = ({metadata}) => {
    //const address = metadata.wallet.address;
    useEffect(() => {
      const runAsync = async () => {
        console.log('run async', metadata.topic);
        const res = await signClient.core.pairing.ping({ topic: metadata.topic })
        console.log('ping pair', res);
      }
      runAsync();
      //console.log('pairdata', metadata);
    }, [metadata])
    const removePair = async () => {
      await signClient.core.pairing.disconnect({ topic: metadata.topic });
      getPairs();
    }

    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
        
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
      </HStack>
    )
  }

  const approve = async () => {
    /*const accountList = selectedWallets.map((wallet) => {
      return request['params']['requiredNamespaces']['eip155']['chains'].map((chain) => {
        return chain+ ':' + wallet.wallet.address;
      })
    })
    const payload = {
      id: request['params']['id'],
      namespaces: {
        eip155: {
          accounts: accountList.flat(),
          events: request['params']['requiredNamespaces']['eip155']['events'],
          methods: request['params']['requiredNamespaces']['eip155']['methods'],
        },
      },
    };
    
    //console.log(payload);
    const { topic, acknowledged } = await signClient.approve(payload);
    const session = await acknowledged();
    //const pairings = signClient.core.pairing.getPairings();
    //console.log(pairings);
    navigation.navigate('ViewWallet');*/
  }

  const reject = async () => {
    /*const payload = {
      id: request['params']['id'],
      reason: {
        code: 1,
        message: translations[language].ConnectionRequest.rejected,
      },
    }

    await signClient.reject(payload);
    navigation.navigate('ViewWallet');*/
  }

  return (
    <GuestLayout>
      <Center         
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        minH={'100%'}
      >
        <VStack space={5} py={4}>
          {
            pairings.map((val, i) => {
              return (
                  <Pair metadata={val} key={'Pair'+i} />                 
              )              
            })
          }
        </VStack>
      </Center>
    </GuestLayout>
  );
}