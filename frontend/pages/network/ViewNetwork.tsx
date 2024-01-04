import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Input,
  KeyboardAvoidingView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from 'react-native';
import { useRecoilState } from "recoil";

import { Border, Color } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { activeNetwork, selectedNetwork, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";
import { updateNetwork } from "../../store/network";

export default function ViewNetwork({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [network, setNetwork] = useRecoilState(selectedNetwork);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  const [name, setName] = useState('');
  const [chainId, setChainId] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');
  const [blockExplorer, setExplorer] = useState('');
  const { colorMode } = useColorMode();

  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (network && network.symbol) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + network.symbol.toLowerCase() + '.png');
    } else {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png');
    }
  }, [network])

  const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setName(event.nativeEvent.text)
  }
  const handleChainIdChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setChainId(event.nativeEvent.text)
  }
  const handleRpcUrlChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setRpcUrl(event.nativeEvent.text)
  }
  const handleSymbolChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setSymbol(event.nativeEvent.text)
  }
  const handleExplorerChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setExplorer(event.nativeEvent.text)
  }

  useEffect(() => {
    setName(network.name);
    setChainId(String(network.chainId));
    setRpcUrl(network.rpcUrl);
    setSymbol(network.symbol);
    setExplorer(network.blockExplorer as string);
  }, [network]);

  const _setActiveNetwork = async () => {
    setActiveNetwork(network);
    await updateNetwork(network);
  }

  const isActiveNetwork = _activeNetwork.chainId === network.chainId;

  const saveNetwork = () => {
    const runAsync = async () => {
      if (name.length > 0 && chainId !== '0' && rpcUrl.length > 0 && symbol.length > 0) {
        const _network = {
          blockExplorer,
          chainId: parseInt(chainId),
          name,
          rpcUrl,
          symbol,
        };
        setActiveNetwork(_network);
        await updateNetwork(_network);
        //setNetwork(_network)
        //storeActiveNetwork(_network);
        setLoading(false);
        setIsEditing(false);
      } else {
        setLoading(false);
      }
    }

    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
  }

  return (
    <Center alignItems="center" flex={1} px="3">

      {!isEditing &&
        <KeyboardAvoidingView h={{
          base: "400px",
          lg: "auto"
        }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Box>
            <HStack justifyContent={'space-between'} >
              <VStack>
                <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" ml="10px" mb="10px" mr="1" mt="4px" source={{
                  uri: avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
                }} >
                  {isActiveNetwork && <Avatar.Badge bg="green.500" />}
                </Avatar>
              </VStack>

              <Button onPress={() => { setIsEditing(true) }} ml={'auto'} py={0} px={8} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language as keyof typeof translations].ViewNetwork.edit_button}</Text></Button>
            </HStack>
            <VStack space={4} px={2} py={4} >
              <Text fontSize={28} fontWeight={'bold'}>{network.name}</Text>
              <Text fontSize={20}>Chain Id: {network.chainId}</Text>
              <Text fontSize={20}>Symbol: {network.symbol}</Text>
              <Text fontSize={20}>RPC Url: {truncateString(network.rpcUrl, 22)}</Text>
            </VStack>

            {isActiveNetwork ?
              <Alert maxW="400" status="info" colorScheme="info">
                <Center>
                  <Text color={'black'} fontWeight={'bold'}>{translations[language as keyof typeof translations].ViewNetwork.active_network} </Text>
                </Center>
              </Alert>
              :
              <Box alignItems="center" marginBottom={20} h={'full'} w={'full'}>
                <Button onPress={() => { _setActiveNetwork(); }} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language as keyof typeof translations].ViewNetwork.use_network}</Text></Button>
              </Box>
            }

          </Box>
        </KeyboardAvoidingView>
      }
      {isEditing &&
        <KeyboardAvoidingView h={{
          base: "400px",
          lg: "auto"
        }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Box>
            <VStack space={2} py={2} alignItems='center'>
              <Text style={styles.editTextMiddle} color={colorMode === 'dark' ? Color.white : Color.black} fontSize={'md'} fontWeight={'bold'}>{network.name}</Text>

              <Text style={styles.editTextTop} fontSize={'md'}  >Edit this network</Text>
            </VStack>
            <VStack space={2} px={2} alignItems='center'>
              <Input style={styles.textoImput} w="full" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.name_placeholder} />
              <Input style={styles.textoImput} w="full" mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.chainId_placeholder} />
              <Input style={styles.textoImput} w="full" mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.rpcUrl_placeholder} />
              <Input style={styles.textoImput} w="full" mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.symbol_placeholder} />
              <Input style={styles.textoImput} w="full" mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.explorer_placeholder} />
            </VStack>

            <Box alignItems="center" marginBottom={20} w={'full'}>
              <Button w={'full'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={saveNetwork} isLoading={loading}>
                <Text color={colorMode === 'dark' ? Color.black : Color.white} fontWeight={'bold'}>{translations[language as keyof typeof translations].CreateNetwork.button_save}</Text>
              </Button>
              {/* <Button onPress={() => {setIsEditing(false)}} variant="outline"><Text>{'Cancel'}</Text></Button>   */}
            </Box>
          </Box>
        </KeyboardAvoidingView>
      }

    </Center>
  )
}



const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.black,
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    position: 'relative',
  },
  editTextMiddle: {
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'center',
  },
  editTextTop: {
    color: Color.gray_100,
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'center',
  },
  textoImput: {
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  }
});