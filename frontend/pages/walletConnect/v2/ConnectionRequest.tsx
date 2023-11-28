import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import Svg, { Circle } from "react-native-svg";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { AppWallet, language as stateLanguage, walletList } from "../../../service/state";
import { truncateString } from "../../../service/utility";
import { signClient } from "../../../service/walletConnect";

export default function ConnectionRequest({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({} as any);
  const [walletState, ] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([] as AppWallet[]);
  const [page, setPage] = useState(0);
  const [language, ] = useRecoilState(stateLanguage);
  const {colorMode} = useColorMode();
  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    const runAsync = async () => {
      if (requestDetails) {
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

  const WalletItem = ({metadata} : {metadata : AppWallet}) => {
    const address = metadata.address;
    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
          
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Text fontSize="md" bold>
            {metadata.name}
          </Text>
          <Text color="coolGray.500">{truncateString(metadata.address, 25)}</Text>
        </HStack>
      </HStack>
    )
  }

  const SelectWallet2 = ({metadata} : {metadata: AppWallet}) => {
    const address = metadata.address;
    const selectWallet = () => {
      setSelectedWallets([...selectedWallets, metadata])   
    }
    const unSelectWallet = () => {
      setSelectedWallets(selectedWallets.filter((val) => {
        return val.address !== address
      }));
    }

    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Checkbox value="test" isChecked={selectedWallets.includes(metadata)} onChange={(state) => {
            if (state) {
              selectWallet();
            } else {
              unSelectWallet();
            }
          }} accessibilityLabel={`Checkbox used to select a specific wallet. This one is ${metadata.name}`} aria-label={`Checkbox used to select a specific wallet. This one is ${metadata.name}`} />
          <Text fontSize="md" bold>
            {metadata.name}
          </Text>
          <Text color="coolGray.500">{truncateString(metadata.address, 25)}</Text>
        </HStack>
      </HStack>
    )
  }

  const approve = async () => {
    const accountList = selectedWallets.map((wallet) => {
      if (request['params']['requiredNamespaces']['eip155']) {
        return request['params']['requiredNamespaces']['eip155']['chains'].map((chain: string) => {
          return chain+ ':' + wallet.address;
        })
      } else if (request['params']['optionalNamespaces']['eip155']) {
        return request['params']['optionalNamespaces']['eip155']['chains'].map((chain: string) => {
          return chain+ ':' + wallet.address;
        })
      }
      return wallet.address;
    })
    const payload = {
      id: request['params']['id'],
      namespaces: {
        eip155: {
          accounts: accountList.flat(),
          events: request['params']['requiredNamespaces']['eip155'] ? request['params']['requiredNamespaces']['eip155']['events'] : request['params']['optionalNamespaces']['eip155']['events'],
          methods: request['params']['requiredNamespaces']['eip155'] ? request['params']['requiredNamespaces']['eip155']['methods'] : request['params']['optionalNamespaces']['eip155']['methods'] ,
        },
      },
    };
    
    const { topic, acknowledged } = await signClient.approve(payload);
    const session = await acknowledged();
    //const pairings = signClient.core.pairing.getPairings();
    navigation.navigate('ViewWallet');
  }

  const reject = async () => {
    const payload = {
      id: request['params']['id'],
      reason: {
        code: 1,
        message: translations[language as keyof typeof translations].ConnectionRequest.rejected,
      },
    }

    await signClient.reject(payload);
    navigation.navigate('ViewWallet');
  }

  return (
    <GuestLayout>
      <Center         
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        height={'100%'}
      >
        {page === 0 && walletState && 
          <VStack>
            <VStack py={5}>
                <Center><Heading size="md" mb={2} mt={3}><Text>{translations[language as keyof typeof translations].ConnectionRequest.title}</Text></Heading></Center>
                <Center><Heading size="sm"><Text color={'gray.500'}>{translations[language as keyof typeof translations].ConnectionRequest.wallet_select_instructions}</Text></Heading></Center>
                <VStack space={5} py={4}>
                  {
                    walletState.map((val, i) => {
                      return (
                          <SelectWallet2 metadata={val} key={val.name+i} />                 
                      )              
                    })
                  }
                </VStack>
            </VStack>
            
            {selectedWallets.length > 0 && 
              <Button.Group>
                <Button w={'full'} onPress={nextPage} position={'relative'} bottom={0} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text fontWeight={'bold'} color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language as keyof typeof translations].ConnectionRequest.next_button}</Text></Button>
              </Button.Group>
            }
          </VStack>
        }
        {page === 1 && request && request['params'] && 
          <>
            <VStack >
              {/*<Button onPress={previousPage} variant={'solid'} colorScheme={'coolGray'} rounded="none" mb={4}><Text color={'text.300'}>{'back'}</Text></Button>*/}
              
              <Center><Heading size="md" mb={4}><Text>{translations[language as keyof typeof translations].ConnectionRequest.title}</Text></Heading></Center>
            
              <HStack space={0} justifyContent="center" alignContent={'center'} rounded="full" mx={8} p={4} py={2} borderStyle={'solid'} borderWidth={1} borderColor={'gray'}>
                <Avatar bg="gray.500" source={{
                  uri: request['params']?.proposer?.metadata?.icons[0]
                }}></Avatar>
                <Svg width={'50%'} height={'100%'} viewBox="0 0 91 7" fill="none">
                  <Circle cx="1.82" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="10.556" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="19.292" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="28.028" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="36.764" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="45.5" cy="3.5" r="3.5" fill="#D4E815"/>
                  <Circle cx="54.236" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="62.972" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="71.708" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="80.444" cy="3.82" r="1.82" fill="#D4E815"/>
                  <Circle cx="89.18" cy="3.82" r="1.82" fill="#D4E815"/>
                </Svg>
                <Avatar bg={Color.transparent} source={colorMode === 'dark' ? require('../../../assets/images/icon-white.png') : require('../../../assets/images/icon-black.png')}></Avatar>
              </HStack>
              <Center>
                <Text >{request['params'].proposer.metadata.url}</Text>
              </Center>
              <Center mt={5}>          
                {
                  selectedWallets.map((metadata, i) => {                  
                    return (
                      <Box key={metadata.address}>
                        <WalletItem metadata={metadata}/>
                      </Box>
                    )
                  })
                }
              </Center>
            </VStack>
            <Button.Group isAttached  colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text color={colorMode === 'dark' ? Color.black : Color.white } fontWeight={'bold'}>{translations[language as keyof typeof translations].ConnectionRequest.approve_button}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{translations[language as keyof typeof translations].ConnectionRequest.reject_button}</Text></Button>
            </Button.Group>
          </>
        }        
      </Center>
    </GuestLayout>
  );
}