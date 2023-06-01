import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Center,
  CheckIcon,
  CloseIcon,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  MoonIcon,
  Pressable,
  ScrollView,
  Select,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";


import translations from "../../assets/translations";
import { activeNetwork, networkList, language as stateLanguage, tokenList, walletList } from "../../service/state";
import { Token } from "../../service/token";
import { getNetworks } from "../../store/network";
import { addToken, getTokens, updateToken } from "../../store/token";


export default function AddToken ({navigation, route, storage}) {
  const [networks, setNetworks] = useState([]);
  const [language, ] = useRecoilState(stateLanguage);
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

  const handleNameChange = (event) => {
    //console.log(event.nativeEvent.text);
    setName(event.nativeEvent.text)
  }
  const handleAddressChange = (event) => {
    //console.log(event.nativeEvent.text);
    setAddress(event.nativeEvent.text)
  }
  const handleChainIdChange = (event) => {
    //console.log(event.nativeEvent.text);
    setChainId(event.nativeEvent.text);
  }
  const handleTypeChange = (event) => {
    //console.log(event.nativeEvent.text);
    setType(event.nativeEvent.text)
  }


  const saveToken = () => {
    const runAsync = async () => {
      if (name.length > 0 && address.length > 0 && type.length > 0 && Number.isInteger(chainId)) {
        //console.log(_wallet.privateKey, name);
        const _token : Token = {
          address,
          chainId : Number.parseInt(chainId),
          name,
          type,
        };
        console.log('token to insert', _token);
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
        console.log('failed validation', name.length > 0 && address.length > 0 && type.length > 0 && Number.isInteger(chainId));
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
        <Button onPress={() => {saveToken();}} isLoading={loading} disabled={name.length === 0 || chainId.length === 0 || address.length === 0 || type.length === 0}><Text>{translations[language].AddToken.submit_button}</Text></Button>
      </>
    </ScrollView>
  );
}
