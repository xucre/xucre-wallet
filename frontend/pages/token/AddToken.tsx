import {
  Box,
  Button,
  CheckIcon,
  Input,
  ScrollView,
  Select,
  Text,
  useColorMode,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState, } from "recoil";


import translations from "../../assets/translations";
import { language as stateLanguage, tokenList } from "../../service/state";
import { Token } from "../../service/token";
import { getNetworks } from "../../store/network";
import { addToken } from "../../store/token";


export default function AddToken ({navigation, route, storage}) {
  const [networks, setNetworks] = useState([]);
  const [language, ] = useRecoilState(stateLanguage);
  const [tokens, setTokens] = useRecoilState(tokenList);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('0x7a9fc38ee723ce90cb8155b6ef04ef2c53a64124');
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

  const handleNameChange = (event) => {
    setName(event.nativeEvent.text)
  }
  const handleAddressChange = (event) => {
    setAddress(event.nativeEvent.text)
  }
  const handleChainIdChange = (event) => {
    setChainId(event.nativeEvent.text);
  }
  const handleTypeChange = (event) => {
    setType(event.nativeEvent.text)
  }


  const saveToken = () => {
    const runAsync = async () => {
      if (name.length > 0 && address.length > 0 && type.length > 0 && Number.isInteger(chainId)) {
        
        const _token : Token = {
          address,
          chainId : Number.parseInt(chainId),
          name,
          type,
        };
        await addToken(_token);
        setTokens([
          tokens,
          _token
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
    <ScrollView w={'full'} h={'full'} marginTop={5}>
      <>
        <Box alignItems="center" marginBottom={3}>
          <Input w="100%" mb={2} value={name} onChange={handleNameChange} placeholder={translations[language].AddToken.name_placeholder}  />
          <Select selectedValue={chainId} w="100%" accessibilityLabel={translations[language].AddToken.chain_placeholder} placeholder={translations[language].AddToken.chain_placeholder} _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={itemValue => setChainId(itemValue)}>
            {
              networks.map((_network) => {
                return (
                  <Select.Item key={_network.chainId} label={_network.name} value={_network.chainId} />
                )
              }) 
            }              
          </Select>
          <Input w="100%" mb={2} value={address} onChange={handleAddressChange} placeholder={translations[language].AddToken.address_placeholder}  />
        </Box>
        <Button colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={() => {saveToken();}} isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || address.length === 0 || type.length === 0}><Text color={'white'}>{translations[language].AddToken.submit_button}</Text></Button>
      </>
    </ScrollView>
  );
}
