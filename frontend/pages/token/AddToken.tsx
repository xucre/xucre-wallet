import {
  Box,
  Button,
  CheckIcon,
  Input,
  ScrollView,
  Select,
  Text,
  VStack,
  useColorMode,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState, } from "recoil";


import translations from "../../assets/translations";
import { language as stateLanguage, tokenList } from "../../service/state";
import { Token } from "../../service/token";
import { getNetworks } from "../../store/network";
import { addToken } from "../../store/token";
import { Network } from "../../service/network";
import { Color } from "../../../GlobalStyles";
import ContainedButton from "../../components/ui/ContainedButton";


export default function AddToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [networks, setNetworks] = useState([] as Network[]);
  const [language,] = useRecoilState(stateLanguage);
  const [tokens, setTokens] = useRecoilState(tokenList);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('token');
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  useEffect(() => {
    const runAsync = async () => {
      setNetworks(await getNetworks())
    }
    runAsync();
  }, [])
  const {
    colorMode
  } = useColorMode();

  const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setName(event.nativeEvent.text)
  }
  const handleAddressChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setAddress(event.nativeEvent.text)
  }
  const handleChainIdChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setChainId(event.nativeEvent.text);
  }
  const handleTypeChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setType(event.nativeEvent.text)
  }


  const saveToken = () => {
    const runAsync = async () => {
      if (name.length > 0 && address.length > 0 && type.length > 0 && Number.isInteger(chainId)) {

        const _token: Token = {
          address,
          chainId: Number.parseInt(chainId),
          name,
          type,
        };
        await addToken(_token);
        setTokens([
          ...tokens as never[],
          _token as never
        ]);
        setLoading(false);
        setTimeout(() => {
          navigation.navigate('ViewWallet');
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
    <Box marginTop={5} marginBottom={3}>
      <VStack
        minW="300px"
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        marginTop={0}
      >
        <Text fontSize="2xl" bold mb={"5"} pt={1}>
          {translations[language as keyof typeof translations].AddToken.title}
        </Text>

        <Input
          w="90%"
          h={16}
          mb={2}
          value={name}
          onChange={handleNameChange}
          placeholder={translations[language as keyof typeof translations].AddToken.name_placeholder}
        />
        <Select
          selectedValue={chainId}
          w="90%"
          h={16}
          accessibilityLabel={translations[language as keyof typeof translations].AddToken.chain_placeholder}
          placeholder={translations[language as keyof typeof translations].AddToken.chain_placeholder}
          _selectedItem={{
            bg: colorMode === "dark" ? "primary.600" : "info.600",
            color: Color.white,
            fontSize: "lg",
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          mb={"2"}
          onValueChange={itemValue => setChainId(itemValue)}
        >
          {
            networks.map((_network) => {
              return (
                <Select.Item key={_network.chainId} label={_network.name} value={_network.chainId.toString()} />
              )
            })
          }
        </Select>
        <Input
          w="90%"
          h={16}
          mb={2}
          value={address}
          onChange={handleAddressChange}
          placeholder={translations[language as keyof typeof translations].AddToken.address_placeholder}
        />

        <ContainedButton
          buttonText={translations[language as keyof typeof translations].AddToken.submit_button}
          mt={6}
          w="90%"
          onPress={() => { saveToken(); }}
          isLoading={loading}
          disabled={name.length === 0 || chainId.length === 0 || address.length === 0 || type.length === 0}
        />
      </VStack>
    </Box>
  );
}
