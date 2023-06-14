/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
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
import {StyleSheet} from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState, } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import erc20Abi from '../../../contracts/erc20.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";
import { Token } from "../../service/token";
import { Transaction } from "../../service/transaction";
import { addToken, getTokenByChain, updateToken } from "../../store/token";
import { addTransaction } from "../../store/transaction";


export default function SendToken ({navigation, route, storage}) {
  const [language, ] = useRecoilState(stateLanguage);
  const token = route.params?.token;
  const [selectedToken, setSelectedToken] = useState({} as Token);
  const [tokens, setTokens] = useState([] as readonly Token[]);
  const [network, ] = useRecoilState(activeNetwork);
  const [pendingTransactions, setTransactionList] = useRecoilState(transactionList);
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
      console.log('sendToken',network, _tokens);
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
    //console.log(address, selectedToken, amount);
    const runAsync = async () => {
      try {
        if (address.length > 0) {
          if (selectedToken.type === 'token' && wallet.address) {
            const _contract = new ethers.Contract(selectedToken.address, erc20Abi, provider);    
            const contract = _contract.connect(wallet);
            const _submitted = await contract.transfer(ethers.utils.getAddress(address) , ethers.utils.parseEther(amount));
            //console.log('submitted',_submitted);
            const _transaction = {
              chainId: _submitted.chainId,
              data: _submitted.data,
              from: _submitted.from,
              hash: _submitted.hash,
              nonce: _submitted.noonce,
              status: 'pending',
              submitDate: new Date(),
              to: _submitted.to,
              value: _submitted.value,
            } as Transaction;
            await addTransaction(_transaction);
            setTransactionList([...pendingTransactions, _submitted]);
            if (_transaction) {
              console.log('transaction submitted', _submitted.hash);
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
    <ScrollView w={'full'} h={'full'} marginTop={100} >
      <>
        <Box alignItems="center" marginBottom={400}>
          <Text fontSize="2xl" bold mb={'5'} pt={1}>{translations[language].SendToken.title}</Text>        
        
          <Select selectedValue={selectedToken.address} w="90%" accessibilityLabel={translations[language].SendToken.token_placeholder} placeholder={translations[language].SendToken.token_placeholder} _selectedItem={{
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
          
          <Input  style={colorMode === 'dark' ? styles.textoImput : lightStyles.textoImput} fontSize={35} keyboardType="numeric" w="90%" h="30%" mb={2} value={amount} onChange={handleAmountChange}  />
          <Input style={colorMode === 'dark' ? styles.textoImput : lightStyles.textoImput}   w="90%" h="35%" mb={2} value={address} onChange={handleAddressChange} placeholder={translations[language].SendToken.address_placeholder}  />
          <Button style={colorMode === 'dark' ? styles.buttonContainer : lightStyles.buttonContainer} onPress={() => {send();}} isLoading={loading} disabled={address.length === 0 || type.length === 0}><Text color={colorMode === 'dark' ? 'black' : 'white'} fontWeight={'bold'}>{translations[language].SendToken.submit_button}</Text></Button>
        </Box>
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#D4E815',
    borderColor: '#000',
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    left: 10,
    position: 'relative',
    textAlign: "left",
    top: 180,
    width: 340,

  }, 
  ethereumTestnet: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    left: 18,
    letterSpacing: -0.2,
    lineHeight: 21,
    position: "absolute",
    textAlign: "left",
    top: 1,
    width: 300,
  },
   groupParent: {
    height: 56,
    left: 22,
    position: "relative",
    top: 100,
    width: 346,
   }, groupWrapperLayout: {
    height: 56,
    top: 0,
    width: 339,
  }, rectangleParent: {
    left: 7,
    position: "absolute",
  }, textoImput: {
    backgroundColor: Color.gray_300,
    borderColor: "#7b7b7b",
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
    top: 0,
    width: 339,
  }, titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    textAlign: "center",
    top: 50,
  },
});


const lightStyles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#1B1E3F',
    borderColor: '#fff',
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: 'bold',
    left: 10,
    position: 'relative',
    textAlign: "left",
    top: 180,
    width: 340,

  }, 
  ethereumTestnet: {
    color: Color.black,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    left: 18,
    letterSpacing: -0.2,
    lineHeight: 21,
    position: "absolute",
    textAlign: "left",
    top: 1,
    width: 300,
  },
   groupParent: {
    height: 56,
    left: 22,
    position: "relative",
    top: 100,
    width: 346,
   }, groupWrapperLayout: {
    height: 56,
    top: 0,
    width: 339,
  }, rectangleParent: {
    left: 7,
    position: "absolute",
  }, textoImput: {
    backgroundColor: Color.white,
    borderColor: Color.gray_100,
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
    top: 0,
    width: 339,
  }, titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    textAlign: "center",
    top: 50,
  },
});