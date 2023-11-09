import {
  Button,
  Center,
  Heading,
  Input,
  KeyboardAvoidingView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import {Platform, StyleSheet} from 'react-native';
import { useRecoilState, } from "recoil";

import { Border, Color, FontFamily } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { Network } from "../../service/network";
import { networkList, language as stateLanguage } from "../../service/state";
import { storeNetwork, } from "../../store/network";


export default function CreateWallet ({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const [networks, setNetworks] = useRecoilState(networkList);
  const [language, ] = useRecoilState(stateLanguage);
  const [loading, setLoading] = useState(false);
  const [blockExplorer, setBlockExplorer] = useState('');
  const [chainId, setChainId] = useState('');
  const [name, setName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const {
    colorMode
  } = useColorMode();
  const icon_color = colorMode ==='dark'? 'white':'black';

  const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setName(event.nativeEvent.text)
  }
  const handleExplorerChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setBlockExplorer(event.nativeEvent.text)
  }
  const handleChainIdChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setChainId(event.nativeEvent.text);
  }
  const handleRpcUrlChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setRpcUrl(event.nativeEvent.text)
  }
  const handleSymbolChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setSymbol(event.nativeEvent.text)
  }


  const saveNetwork = () => {
    const runAsync = async () => {
      if (name.length > 0 && chainId.length > 0 && rpcUrl.length > 0 && symbol.length > 0 && Number.isInteger(Number.parseInt(chainId))) {
        
        const _network : Network = {
          blockExplorer,
          chainId : Number.parseInt(chainId),
          name,
          rpcUrl,
          symbol,
        };
        await storeNetwork(_network);
        setNetworks([
          ...networks,
          _network
        ]);
        setLoading(false);
        setTimeout(() => {
          navigation.navigate('SelectNetwork');
        }, 100);
        
      } else {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
    
  };

  return (
        <Center style={{backgroundColor: colorMode === 'dark' ? Color.gray_200 : Color.white}} flex={1} px="3">          
          <KeyboardAvoidingView h={{
            base: "400px",
            lg: "auto"
          }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <VStack minW="300px" w="full" alignItems="center" flex="1" justifyContent={'center'} marginBottom={20} marginTop={20}>
              <Heading mb={5} style={styles.titleLayout} fontWeight={'normal'}><Text color={colorMode === 'dark' ? Color.white : Color.black}>New Network</Text></Heading>
              <Input style={styles.textoImput} mb={2} value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.name_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={chainId} onChange={handleChainIdChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.chainId_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.rpcUrl_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={symbol} onChange={handleSymbolChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.symbol_placeholder}  />
              <Input style={styles.textoImput} mb={2} value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.explorer_placeholder}  />
              <Button.Group>
                <Button w={'100%'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveNetwork();}} isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || rpcUrl.length === 0 || symbol.length === 0}>
                  <Text fontWeight={'bold'} style={{color: colorMode === 'dark' ? Color.black : Color.white}}>{translations[language as keyof typeof translations].CreateNetwork.submit_button}</Text>
                </Button>
              </Button.Group>
              
            </VStack>
              
          </KeyboardAvoidingView>
        </Center>
  );
}

const styles = StyleSheet.create({
  textoImput: {
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  },
    titleLayout: {
      color: Color.black,
      fontFamily: FontFamily.inter,
      fontSize: 30,
      textAlign: "center",
    },
});