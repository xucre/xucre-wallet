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
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import GuestLayout from "../../layouts/GuestLayout";
import { language as stateLanguage, walletList } from "../../service/state";
import { truncateString } from "../../service/utility";
import { signClient } from "../../service/walletConnect";

export default function SignTypedData({navigation, route}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({});
  const [domain, setDomain] = useState({});
  const [types, setTypes] = useState({});
  const [value, setValue] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState, ] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const runAsync = async () => {
      if (requestDetails) {
        //console.log(requestDetails);
        setRequest(requestDetails);
      }
    }

    runAsync();
  }, [requestDetails]);

  useEffect(() => {
    if (Object.keys(request).length > 0) {
      setWalletAddress(request['params']['request']['params'][0]);
      const rawData = request['params']['request']['params'][1];
      const data = JSON.parse(rawData);
      setDomain(data.domain);
      setTypes(data.types);
      setValue(data.message);
    }
  }, [request])


  const approve = async () => {
    // implement signer._signTypedData(domain, types, value);
    //const pairings = signClient.core.pairing.getPairings();
    //console.log(pairings);
    navigation.navigate('Home');
  }

  const reject = async () => {
    const payload = {
      id: request['params']['id'],
      reason: {
        code: 1,
        message: "rejected by user",
      },
    }

    await signClient.reject(payload);
    navigation.navigate('Home');
  }

  return (
    <GuestLayout>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        {request && request['params'] && value && value['contents'] && 
          <Box>
            <VStack height={'90%'}>
              <Center mt={5}>          
                <Heading size="md" mb={4}><Text>Sign Message</Text></Heading>
                <Text>{value['contents']}</Text>
              </Center>
            </VStack>
            <Button.Group isAttached colorScheme="blue" >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text>{'Approve'}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{'Reject'}</Text></Button>
            </Button.Group>
          </Box>
        }        
      </Box>
    </GuestLayout>
  );
}