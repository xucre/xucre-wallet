import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  KeyboardAvoidingView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Platform, StyleSheet } from 'react-native';
import { useRecoilState, } from "recoil";

import { Border, Color, FontFamily } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { Network } from "../../service/network";
import { networkList, language as stateLanguage } from "../../service/state";
import { storeNetwork, } from "../../store/network";
import ContainedButton from "../../components/ui/ContainedButton";


export default function CreateWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [networks, setNetworks] = useRecoilState(networkList);
  const [language,] = useRecoilState(stateLanguage);
  const [loading, setLoading] = useState(false);
  const [blockExplorer, setBlockExplorer] = useState('');
  const [chainId, setChainId] = useState('');
  const [name, setName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [symbol, setSymbol] = useState('');

  const {
    colorMode
  } = useColorMode();
  const icon_color = colorMode === 'dark' ? 'white' : 'black';

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

        const _network: Network = {
          blockExplorer,
          chainId: Number.parseInt(chainId),
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
    <Box flex={1} px="3">
      <KeyboardAvoidingView h={{
        base: "400px",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <VStack w="full" alignItems="center" flex="1" justifyContent={'center'} marginBottom={20} marginTop={20} space={4}>
          <Input value={name} onChange={handleNameChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.name_placeholder} />
          <Input value={chainId} onChange={handleChainIdChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.chainId_placeholder} />
          <Input value={rpcUrl} onChange={handleRpcUrlChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.rpcUrl_placeholder} />
          <Input value={symbol} onChange={handleSymbolChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.symbol_placeholder} />
          <Input value={blockExplorer} onChange={handleExplorerChange} placeholder={translations[language as keyof typeof translations].CreateNetwork.explorer_placeholder} />
          <Button.Group>
            <ContainedButton isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || rpcUrl.length === 0 || symbol.length === 0} width={'full'} onPress={() => { saveNetwork() }} style={{ marginTop: 4 }} buttonText={translations[language as keyof typeof translations].CreateNetwork.submit_button} />
          </Button.Group>

        </VStack>

      </KeyboardAvoidingView>
    </Box>
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