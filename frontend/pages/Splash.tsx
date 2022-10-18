import { useWalletConnect } from '@walletconnect/react-native-dapp';
import {Box, Button, Center, Hidden, Image, Text, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';

import GuestLayout from '../layouts/GuestLayout';


function HeaderLogo() {
  return (
    <Box alignItems="center" justifyContent="center">
      <Hidden colorMode="light">        
        <Image
          source={require('../assets/images/logo-long-white.png')}
          height="66"
          width="375"
          alt="Alternate Text"
        />
      </Hidden>
      <Hidden colorMode="dark">
        <Image
          source={require('../assets/images/logo-long.png')}
          height="66"
          width="375"
          alt="Alternate Text"
        />
      </Hidden>
    </Box>
  );
}
export default function Splash({navigation}) {
  const connector = useWalletConnect();  
  const [dataOutput, setDataOutput] = useState([]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  const activate = async () => {
    //activateBrowserWallet();
    connector.connect();
    if (isComponentMounted) {
      setDataOutput(connector.accounts);
    }
  }


  const goToChannels = () => {
    if (isComponentMounted) {
      navigation.navigate('Channels', {artistId: null, type: 'all'})
    }
  }

  const logout = async () => {
    connector.killSession();
  }

  function ActionButtons() {
    return (
      <VStack space={4} mt={{ base: 10, md: 12 }}>
        {!connector.connected && 
          <Button
            variant="outline"
            py={4}
            _dark={{
              borderColor: 'trueGray.50'
            }}
            _light={{
              borderColor: 'trueGray.700'
            }}
            _text={{
              color: 'coolGray.50',
            }}
            _hover={{
              bg: 'primary.600',
            }}
            _pressed={{
              bg: 'primary.700',
            }}
            onPress={activate}
          >
            <Text>CONNECT</Text>
          </Button>
        }
        {connector.connected && 
            <>
              <Button variant="outline"
              onPress={logout}><Text>LOGOUT</Text></Button>
              <Button variant="solid"
              onPress={goToChannels}><Text>Access Channels</Text></Button>
              <Text>{dataOutput}</Text>
            </>
          }
      </VStack>
    );
  }

  return (
    <GuestLayout>
      <Center w="100%" flex={1}>
        <Box
          maxW="500"
          w="100%"
          height={{ md: '544' }}
          px={{ base: 4, md: 8 }}
          justifyContent="center"
        >
          <HeaderLogo />
          <ActionButtons />
        </Box>
      </Center>
    </GuestLayout>
  );
}
