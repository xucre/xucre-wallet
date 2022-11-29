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

import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { language as stateLanguage, walletList } from "../../../service/state";
import { truncateString } from "../../../service/utility";
import { signClient } from "../../../service/walletConnect";

export default function ConnectionRequest({navigation, route}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({});
  const [walletState, ] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const runAsync = async () => {
      if (requestDetails) {
        //console.log(requestDetails);
        setRequest(requestDetails)
      }
    }

    runAsync();
  }, [requestDetails]);

  const nextPage = () => {
    setPage(page+1);
  }

  const previousPage = () => {
    setPage(page-1);
  }

  const SelectWallet = ({metadata}) => {
    const address = metadata.wallet.address;
    const selectWallet = () => {
      setSelectedWallets([...selectedWallets, metadata])   
    }
    const unSelectWallet = () => {
      setSelectedWallets(selectedWallets.filter((val) => {
        return val.wallet.address !== address
      }));
    }
    return (
      <HStack alignItems="center" justifyContent="space-between" p={4} rounded={'full'} bgColor={selectedWallets.includes(metadata) ? 'coolGray.200' : 'transparent'}>        
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Checkbox value="test" isChecked={selectedWallets.includes(metadata)} onChange={(state) => {
            if (state) {
              selectWallet();
            } else {
              unSelectWallet();
            }
          }} accessibilityLabel="This is a dummy checkbox" />
          <VStack space={1}>
              <Text fontSize="md" bold>
                {metadata.name}
              </Text>
          </VStack>
          
          <Text color="coolGray.500">{truncateString(metadata.wallet.address, 25)}</Text>     
        </HStack>
      </HStack>
    )
  }

  const WalletItem = ({metadata}) => {
    const address = metadata.wallet.address;
    return (
      <HStack alignItems="center" justifyContent="space-between" px={4} py={2} rounded={'full'} bgColor={'coolGray.200'}>        
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <VStack space={1}>
              <Text fontSize="md" bold>
                {metadata.name}
              </Text>
          </VStack>
          
          <Text color="coolGray.500">{truncateString(metadata.wallet.address, 25)}</Text>     
        </HStack>
      </HStack>
    )
  }

  const approve = async () => {
    const accountList = selectedWallets.map((wallet) => {
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
        {page === 0 && walletState && 
          <>
            <VStack height={'90%'}>
                <Center><Heading size="md" mb={2}><Text>Connection Request</Text></Heading></Center>
                <Center><Heading size="sm"><Text>Select Wallet(s)</Text></Heading></Center>
                {
                  walletState.map((val, i) => {
                    return (
                      <Box key={val.name+i} px={4} py={2}>
                        <SelectWallet metadata={val} /> 
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
            
            {selectedWallets.length > 0 && 
              <Button onPress={nextPage} position={'relative'} bottom={0}><Text>{'Next'}</Text></Button>
            }
          </>
        }
        {page === 1 && request && request['params'] && 
          <Box>
            <VStack height={'90%'}>
              <Button onPress={previousPage} variant={'solid'} colorScheme={'coolGray'} rounded="none" mb={4}><Text color={'text.300'}>{'back'}</Text></Button>
              <HStack space={3} justifyContent="center" alignContent={'center'} rounded="full" mx={8} p={4} py={2} borderStyle={'solid'} borderWidth={1} borderColor={'gray'}>
                <Avatar bg="green.500" mr="1" source={{
                  uri: request['params'].proposer.metadata.icons[0]
                }}>
                  <Text pb={0}>{request['params'].proposer.metadata.name || 'DA'}</Text>
                </Avatar>
                <Center>
                  <Text >{request['params'].proposer.metadata.url}</Text>
                </Center>
              </HStack>
              <Center mt={5}>          
                <Heading size="md" mb={4}><Text>Connection Request</Text></Heading>
                {
                  selectedWallets.map((metadata, i) => {                  
                    return (
                      <Box key={metadata.wallet.address}>
                        {i <= 5 && 
                          <>
                            <WalletItem metadata={metadata}/>
                            {(i+1) !== selectedWallets.length && 
                              <Divider orientation={'horizontal'} mt={4} _light={{
                                bg: "muted.800"
                              }} _dark={{
                                bg: "muted.300"
                              }} />
                            }
                          </>
                        }
                        
                      </Box>
                    )
                  })
                }
                <Text >{'Connecting several methods'}</Text>
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