import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { BigNumber, ethers, getDefaultProvider, Wallet } from 'ethers';
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


import erc20Abi from '../../../contracts/erc20.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, walletList } from "../../service/state";
import { Token } from "../../service/token";
import { getNetworks } from "../../store/network";
import { addToken, getTokenByChain, updateToken } from "../../store/token";


export default function SendToken ({navigation, route, storage}) {
  const [language, ] = useRecoilState(stateLanguage);
  const token = route.params?.token;
  const [selectedToken, setSelectedToken] = useState({} as Token);
  const [tokens, setTokens] = useState([] as readonly Token[]);
  const [network, ] = useRecoilState(activeNetwork);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('token');
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  
  const [_wallet, ] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);

  useEffect(() => {
    const runAsync = async () => {
      const _tokens = await getTokenByChain(network.chainId);
      //console.log(_tokens);
      setTokens(_tokens);
    }

    if (network) {
      runAsync()
    }
  }, [network])

  useEffect(() => {
    if (token) {
      setSelectedToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (_wallet.name != '' && network) {
      const _provider = getDefaultProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = _wallet.wallet.connect(_provider);
      setWallet(newWallet);
    }
  }, [_wallet, network]);

  const {
    colorMode
  } = useColorMode();

  const handleAddressChange = (event) => {
    //console.log(event.nativeEvent.text);
    setAddress(event.nativeEvent.text)
  }

  const handleAmountChange = (event) => {
    //console.log(event.nativeEvent.text);
    setAmount(event.nativeEvent.text);
  }

  const handleTokenChange = (tokenAddress) => {
    const _selectedToken = tokens.find((_token) => {
      return _token.address === tokenAddress;
    });
    setSelectedToken(_selectedToken);
  }

  const send = () => {
    console.log(address, selectedToken, amount);
    const runAsync = async () => {
      try {
        if (address.length > 0) {
          //console.log(_wallet.privateKey, name);
          /*const _token : Token = {
            address,
            chainId : Number.parseInt(chainId),
            type,
          };*/
          if (selectedToken.type === 'token' && wallet.address) {
            const _contract = new ethers.Contract(selectedToken.address, erc20Abi, provider);    
            const contract = _contract.connect(wallet);
            const success = await contract.transfer(ethers.utils.getAddress(address) , ethers.utils.parseEther(amount));
            if (success) {
              console.log('successful transfer');
              navigation.navigate('ViewWallet');
            }
            setLoading(false); 
          }   
                 
        } else {
          console.log('failed validation');
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
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
          <Text fontSize="2xl" bold mb={'5'}>{translations[language].SendToken.title}</Text>        
        
          <Select selectedValue={selectedToken.address} w="100%" accessibilityLabel={translations[language].SendToken.token_placeholder} placeholder={translations[language].SendToken.token_placeholder} _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={itemValue => handleTokenChange(itemValue)} mb={'2'}>
            {
              tokens.map((_token) => {
                return (
                  <Select.Item key={_token.address} label={_token.name} value={_token.address} />
                )
              }) 
            }              
          </Select>
          
          <Input keyboardType="numeric" w="100%" mb={2} value={amount} onChange={handleAmountChange}  />
          <Input w="100%" mb={2} value={address} onChange={handleAddressChange} placeholder={translations[language].SendToken.address_placeholder}  />
        </Box>
        <Button onPress={() => {send();}} isLoading={loading} disabled={address.length === 0 || type.length === 0}><Text>{translations[language].SendToken.submit_button}</Text></Button>
      </>
    </ScrollView>
  );
}
