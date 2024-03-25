/* eslint-disable react-native/no-unused-styles */

import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { isAddress } from "ethers/lib/utils";
import {
  Alert,
  Box,
  Button,
  Center,
  CheckIcon,
  HStack,
  Input,
  KeyboardAvoidingView,
  Select,
  Spinner,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import erc20Abi from "../../../contracts/erc20.json";
import translations from "../../assets/translations";
import {
  activeNetwork,
  activeWallet,
  language as stateLanguage,
  transactionList,
} from "../../service/state";
import { Token } from "../../service/token";
import { Transaction } from "../../service/transaction";
import { getTokenByChain } from "../../store/token";
import { addTransaction } from "../../store/transaction";
import { WalletInternal } from "../../store/wallet";
import { xucreToken } from "../../service/constants";
import ContainedButton from "../../components/ui/ContainedButton";

export default function SendToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const toast = useToast();
  const [language] = useRecoilState(stateLanguage);
  const token = route.params?.token;
  const [selectedToken, setSelectedToken] = useState({} as Token);
  const [tokens, setTokens] = useState([] as readonly Token[]);
  const [network] = useRecoilState(activeNetwork);
  const [pendingTransactions, setTransactionList] = useRecoilState(
    transactionList
  );
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [gasBalance, setGasBalance] = useState(BigNumber.from(0))
  const [notEnough, setNotEnough] = useState(false);
  const [address, setAddress] = useState("");
  const [type, setType] = useState("token");
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [checkValues, setcheckValues] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    };
  }, []);

  const [_wallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);

  useEffect(() => {
    const runAsync = async () => {
      const _tokens = await getTokenByChain(network.chainId);
      const coinToken = {
        address: "",
        amount: BigNumber.from(0),
        chainId: network.chainId,
        name: network.symbol,
        type: "coin",
      };
      if (_tokens) {
        const tokenList = [coinToken, ..._tokens as Token[]];
        if (tokenList.find((tok) => {
          return tok.address === xucreToken.address && tok.chainId === xucreToken.chainId
        })) {
          setTokens(tokenList);
          return;
        } else {
          if (network.chainId === xucreToken.chainId) {
            setTokens([xucreToken, ...tokenList]);
            return;
          }
          setTokens([...tokenList as Token[]]);
          return;
        }
      } else {
        if (network.chainId === xucreToken.chainId) {
          setTokens([xucreToken, coinToken]);
          return;
        }
        setTokens([coinToken]);
        return;
      }
    };

    if (network) {
      runAsync();
    }
  }, [network]);

  useEffect(() => {
    if (token) {
      setSelectedToken(token);
    }
  }, [token, wallet]);

  useEffect(() => {
    const runAsync = async () => {
      await wallet.provider.getNetwork();

      const walletBalance = await wallet.getBalance();
      setGasBalance(walletBalance);
      if (selectedToken.type === 'coin' && wallet.address) {
        setBalance(walletBalance);
      } else if (selectedToken.type === 'token' && wallet.address) {
        const contract = new ethers.Contract(selectedToken.address, erc20Abi, provider);
        const _balance = await contract.balanceOf((wallet.address));
        setBalance(_balance);
      }
    }
    if (selectedToken && wallet && wallet.address) {
      runAsync();
    }
  }, [selectedToken, wallet])

  useEffect(() => {
    if (_wallet.name != "" && network) {
      const _provider = getDefaultProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = new WalletInternal(_wallet.wallet).connect(_provider);
      setWallet(newWallet);
    }
  }, [_wallet, network]);

  useEffect(() => {
    if (amount) {
      try {
        const isTooMuch = ethers.utils.parseEther(amount).gt(balance);
        setNotEnough(isTooMuch);
      } catch (err) {
      }
    }
  }, [balance, amount])

  //const hasEnoughGas = amount.length === 0 ? false : ethers.utils.parseEther(amount).gt(gasBalance);

  useEffect(() => {
    if (error.length > 0) {
      toast.show({
        render: () => <ToastMessage />
      });
    }
  }, [error])

  const { colorMode } = useColorMode();

  const handleAddressChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setAddress(event.nativeEvent.text);
  };

  const handleAmountChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setAmount(event.nativeEvent.text);
  };

  const handleTokenChange = (tokenAddress: string) => {
    const _selectedToken = tokens.find((_token) => {
      return _token.address === tokenAddress;
    });
    setSelectedToken(_selectedToken as Token);
  };

  const openPage = (pageName: string, param1: any, param2: any, param3: any, param4: any) => {
    switch (pageName) {
      case 'SendNotificationToken':
        navigation.navigate('SendNotificationToken', { param1, param2, param3, param4 });
        break;
    }
  }

  const send = () => {
    /* if(checkValues){
      openPage('SendNotificationToken', amount, address,selectedToken.name,'send')
    } */
    const runAsync = async () => {
      try {
        if (address.length > 0 && isAddress(address)) {
          setLoadingStage('send')
          if (selectedToken.type === "token" && wallet.address) {
            const _contract = new ethers.Contract(
              selectedToken.address,
              erc20Abi,
              provider
            );
            const contract = _contract.connect(wallet);
            const gasEstimate = await contract.estimateGas.transfer(
              ethers.utils.getAddress(address),
              ethers.utils.parseEther(amount)
            )
            if (gasEstimate.gt(gasBalance)) {
              setLoading(false);
              setError('Not enough gas for this transaction');
              setLoadingStage('');
              return;
            }
            const _submitted = await contract.transfer(
              ethers.utils.getAddress(address),
              ethers.utils.parseEther(amount),
              {
                gasLimit: gasEstimate, // Use the estimated gas
                gasPrice: await provider.getGasPrice(),
              }
            );
            setLoadingStage('confirm');
            await _submitted.wait();

            const _transaction = {
              chainId: _submitted.chainId,
              data: _submitted.data,
              from: _submitted.from,
              hash: _submitted.hash,
              nonce: _submitted.noonce,
              status: "complete",
              submitDate: new Date(),
              to: _submitted.to,
              value: _submitted.value,
            } as Transaction;
            await addTransaction(_transaction);
            setTransactionList([...pendingTransactions as never[], _submitted as never]);
            if (_transaction) {
              //Whatsapp Integration
              if (checkValues) {
                openPage('SendNotificationToken', amount, address, selectedToken.name, 'send')
              }
              navigation.navigate("ViewWallet");
            }
            setLoading(false);
            setError('');
            setLoadingStage('');
          } else if (selectedToken.type === "coin" && wallet.address) {
            const tx = {
              to: address,
              value: ethers.utils.parseEther(amount)
            }

            const gasEstimate = await wallet.estimateGas(tx);

            if (gasEstimate.gt(gasBalance)) {
              setLoading(false);
              setError('Not enough gas for this transaction');
              setLoadingStage('');
              return;
            }
            // Sending ether
            const _submitted = await wallet.sendTransaction(tx)

            setLoadingStage('confirm');
            await _submitted.wait();

            const _transaction = {
              chainId: _submitted.chainId,
              data: _submitted.data,
              from: _submitted.from,
              hash: _submitted.hash,
              nonce: _submitted.nonce,
              status: "complete",
              submitDate: new Date(),
              to: _submitted.to,
              value: _submitted.value,
            } as Transaction;
            await addTransaction(_transaction);
            setTransactionList([...pendingTransactions as never[], _submitted as never]);
            if (_transaction) {
              //Whatsapp Integration
              if (checkValues) {
                openPage('SendNotificationToken', amount, address, selectedToken.name, 'send')
              }
              navigation.navigate("ViewWallet");
            }
            setLoading(false);
            setError('');
            setLoadingStage('');
          } else {
            setLoading(false);
            setError('invalid token')
            setLoadingStage('')
          }
        } else {
          setLoading(false);
          setError('Invalid address');
          setLoadingStage('')
        }
      } catch (err) {
        setLoading(false);
        setError('Error Processing');
        setLoadingStage('')
      }
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
  };

  const ToastMessage = () => {
    return (
      <Alert w="100%" status={'warning'}>
        <VStack space={2} flexShrink={1} w="100%">
          <Text
            color={colorMode === "dark" ? Color.black : Color.white}
            fontWeight={"bold"}>
            {error}
          </Text>
        </VStack>
      </Alert>
    )
  }

  return (
    <Box
      style={{
        backgroundColor: colorMode === "dark" ? Color.black : Color.white,
      }}
      flex={1}
      px="3"
    >
      <KeyboardAvoidingView
        h={{
          base: "400px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {tokens.length > 0 &&
          <VStack
            minW="300px"
            w="100%"
            alignItems="center"
            flex="1"
            justifyContent="space-between"
            marginBottom={0}
            space={2}
          >
            {loading &&
              <VStack>

                <Spinner accessibilityLabel="Loading transaction" />
                <Text fontSize="2xl" bold mb={"5"} pt={1}>
                  {loadingStage === 'send' && 'Sending Transaction'}
                  {loadingStage === 'confirm' && 'Confirming Transaction'}
                </Text>
              </VStack>
            }
            {!loading &&
              <>
                <Text fontSize="2xl" bold mb={"5"} pt={1}>
                  {translations[language as keyof typeof translations].SendToken.title}
                </Text>

                <Select
                  selectedValue={selectedToken.address}
                  w="90%"
                  accessibilityLabel={
                    translations[language as keyof typeof translations].SendToken.token_placeholder
                  }
                  placeholder={translations[language as keyof typeof translations].SendToken.token_placeholder}
                  _selectedItem={{
                    bg: colorMode === "dark" ? "primary.600" : "info.600",
                    color: Color.white,
                    endIcon: <CheckIcon size="5" color={Color.white} />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleTokenChange(itemValue)}
                  mb={"2"}
                >
                  {tokens.map((_token) => {
                    return (
                      <Select.Item
                        key={_token.address}
                        label={_token.name}
                        value={_token.address}
                      />
                    );
                  })}
                </Select>
                <Input
                  style={
                    colorMode === "dark" ? styles.textoImput : lightStyles.textoImput
                  }
                  fontSize={35}
                  keyboardType="numeric"
                  w="90%"
                  h="30%"
                  mb={2}
                  value={amount}
                  onChange={handleAmountChange}
                />
                <Input
                  style={
                    colorMode === "dark" ? styles.textoImput : lightStyles.textoImput
                  }
                  w="90%"
                  mb={2}
                  value={address}
                  onChange={handleAddressChange}
                  placeholder={translations[language as keyof typeof translations].SendToken.address_placeholder}
                />

                <Box>
                  <HStack space={6} my={4}>
                    {/*
                    <Checkbox onChange={setcheckValues}  defaultIsChecked={checkValues} value={'whatsapp'} >{translations[language].WhatsAppNotification.button}</Checkbox>
                  */}
                    {notEnough &&
                      <Alert w="100%" status={'error'}>
                        <VStack space={2} flexShrink={1} w="100%">
                          <Text
                            color={colorMode === "dark" ? Color.black : Color.white}
                            fontWeight={"bold"}>
                            {translations[language as keyof typeof translations].SendToken.not_enough_error}
                          </Text>
                        </VStack>
                      </Alert>
                    }
                  </HStack>
                </Box>
                <Box>
                  <Box>
                    <ContainedButton
                      buttonText={translations[language as keyof typeof translations].SendToken.submit_button}
                      w={"full"}
                      onPress={() => { send(); }}
                      isLoading={loading}
                      disabled={address.length === 0 || type.length === 0 || notEnough}
                    />
                  </Box>
                </Box>
              </>
            }

          </VStack>
        }

      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.transparent,
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: "bold",
  },
  ethereumTestnet: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  groupParent: {
    height: 56,
  },
  groupWrapperLayout: {
    height: 56,
  },
  rectangleParent: {},
  textoImput: {
    backgroundColor: Color.gray_300,
    borderColor: Color.transparent,
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  },
  titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    textAlign: "center",
  },
});

const lightStyles = StyleSheet.create({
  buttonContainer: {
    borderColor: Color.transparent,
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: "bold",
  },
  ethereumTestnet: {
    color: Color.black,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  groupParent: {
    height: 56,
  },
  groupWrapperLayout: {
    height: 56,
  },
  rectangleParent: {},
  textoImput: {
    backgroundColor: Color.white,
    borderColor: Color.transparent,
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    borderWidth: 1,
  },
  titleLayout: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    textAlign: "center",
  },
});
