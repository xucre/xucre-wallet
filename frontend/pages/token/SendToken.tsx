import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { BigNumber, ethers, getDefaultProvider, Wallet } from 'ethers';
import {StyleSheet} from 'react-native';
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
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
          <Text fontSize="2xl" bold mb={'5'}>{translations[language].SendToken.title}</Text>        
        
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
          
          <Input  style={styles.textoImput} fontSize={35} keyboardType="numeric" w="90%" h="30%" mb={2} value={amount} onChange={handleAmountChange}  />
          <Input style={styles.textoImput}   w="90%" h="35%" mb={2} value={address} onChange={handleAddressChange} placeholder={translations[language].SendToken.address_placeholder}  />
          <Button style={styles.buttonContainer} onPress={() => {send();}} isLoading={loading} disabled={address.length === 0 || type.length === 0}><Text color={'#000'} fontWeight={'bold'}>{translations[language].SendToken.submit_button}</Text></Button>
        </Box>
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals, react-native/no-unused-styles
  buttonContainer: {
    fontWeight: 'bold',
    // eslint-disable-next-line sort-keys
    backgroundColor: '#D4E815',
    position: 'relative',
    width: 340,
    left: 10,
    top: 180,
    textAlign: "left",
    borderRadius: Border.br_sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#000',

  }, 
   // eslint-disable-next-line react-native/no-unused-styles
   groupParent: {
    top: 100,
    // eslint-disable-next-line sort-keys
    left: 22,
    width: 346,
    // eslint-disable-next-line sort-keys
    height: 56,
    position: "relative",
   // eslint-disable-next-line react-native/no-unused-styles
   }, rectangleParent: {
    left: 7,
    position: "absolute",
  // eslint-disable-next-line sort-keys
  }, groupWrapperLayout: {
    width: 339,
    // eslint-disable-next-line sort-keys
    top: 0,
    // eslint-disable-next-line sort-keys
    height: 56,
  
  // eslint-disable-next-line react-native/no-unused-styles
  }, titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.interRegular,
    textAlign: "center",
    top: 50,
  },ethereumTestnet: {
    top: 1,
    left: 18,
    width: 300,
    color: Color.white,
    letterSpacing: -0.2,
    fontFamily: FontFamily.interRegular,
    lineHeight: 21,
    fontSize: FontSize.size_base,
    textAlign: "left",
    position: "absolute"
  // eslint-disable-next-line react-native/no-color-literals
  }, textoImput: {
    borderRadius: Border.br_xs,
    backgroundColor: Color.gray_300,
    borderColor: "#7b7b7b",
    borderWidth: 1,
    borderStyle: "solid",
    width: 339,
    top: 0,
  }
});
