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
import { Transaction, waitForTransaction } from "../../service/transaction";
import { getTokenByChain } from "../../store/token";
import { addTransaction } from "../../store/transaction";
import { WalletInternal } from "../../store/wallet";
import { chainIdToNameMap, xucreToken } from "../../service/constants";
import ContainedButton from "../../components/ui/ContainedButton";
import ethTokens from '../../assets/json/eth_tokens.json'
import polygonTokens from '../../assets/json/matic_tokens.json'
import { getActiveNetwork } from "../../store/network";
import { getTokenBalances, getTokenMetadata } from "../../service/api";
import { AlchemyMetadata } from "../../types/token";
import { isSpam } from "../../store/spam";
import useTokens from "../../hooks/useTokens";
import { useMixpanel } from "../../hooks/useMixpanel";
import TokenIcon from "../../components/token/TokenIcon";
import { navigate } from "../../service/RootNavigation";
import { constructBitcoinTransaction, ethereumToBitcoinWallet, getFees, getRawTransaction, getUTXOs, sendBitcoin, validateAddress } from "../../service/bitcoin";
import bitcore from 'bitcore-lib';

export default function SendToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const toast = useToast();
  const [language] = useRecoilState(stateLanguage);
  const token = route.params?.token;
  const to = route.params?.requestDetails?.address;
  const mixpanel = useMixpanel();
  const [selectedToken, setSelectedToken] = useState({} as Token);
  const { tokens } = useTokens();
  const [pendingTransactions, setTransactionList] = useRecoilState(
    transactionList
  );
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [alchemyMetadata, setAlchemyMetadata] = useState({} as AlchemyMetadata);
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [gasBalance, setGasBalance] = useState(BigNumber.from(0))
  const [notEnough, setNotEnough] = useState(false);
  const [address, setAddress] = useState("");
  const [type, setType] = useState("token");
  const [checkValues, setcheckValues] = useState(false);
  const [error, setError] = useState('');

  const [_wallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);

  useEffect(() => {
    mixpanel.track("view_page", { "page": "Send Token" });
  }, [])

  useEffect(() => {
    if (to && to.length > 0) {
      setAddress(to);
    }
  }, [to])

  useEffect(() => {
    if (token) {
      setSelectedToken({ ...token, amount: BigNumber.from(token.amount) } as Token);
    }
  }, [token, wallet]);

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      await wallet.provider.getNetwork();

      const walletBalance = await wallet.getBalance();
      if (isMounted) setGasBalance(walletBalance);
      if (isMounted) setBalance(selectedToken.amount || BigNumber.from(0));
      const result = await getTokenMetadata(selectedToken.address, chainIdToNameMap[selectedToken.chainId as keyof typeof chainIdToNameMap]);
      if (isMounted) setAlchemyMetadata(result as AlchemyMetadata);
    }

    const runAsyncBTC = async () => {
      if (isMounted) setGasBalance(selectedToken.amount || BigNumber.from(0));
      if (isMounted) setBalance(selectedToken.amount || BigNumber.from(0));
      if (isMounted) setAlchemyMetadata({
        logo: selectedToken.logo,
        symbol: selectedToken.symbol,
        decimals: selectedToken.decimals,
        name: selectedToken.name
      } as AlchemyMetadata);
    }
    if (selectedToken.address && wallet && wallet.address) {
      if (selectedToken.chainId !== 20090103) runAsync();
      if (selectedToken.chainId === 20090103) runAsyncBTC();
    }
    return () => { isMounted = false }
  }, [selectedToken, wallet])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      const _provider = getDefaultProvider(_network.rpcUrl);
      if (isMounted) setProvider(_provider);
      const newWallet = new WalletInternal(_wallet.wallet).connect(_provider);
      if (isMounted) setWallet(newWallet);
    }
    if (_wallet.name != "") {
      runAsync();
    }
    return () => { isMounted = false }
  }, [_wallet]);

  useEffect(() => {
    if (amount) {
      try {
        const isTooMuch = ethers.utils.parseUnits(amount, alchemyMetadata.decimals).gt(balance);
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
              ethers.utils.parseUnits(amount, alchemyMetadata.decimals)
            )
            if (gasEstimate.gt(gasBalance)) {
              setLoading(false);
              setError('Not enough gas for this transaction');
              setLoadingStage('');
              return;
            }
            const _submitted = await contract.transfer(
              ethers.utils.getAddress(address),
              ethers.utils.parseUnits(amount, alchemyMetadata.decimals),
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
              to: ethers.utils.getAddress(address),
              value: ethers.utils.parseEther(amount)
            } as ethers.providers.TransactionRequest;

            const gasEstimate = await wallet.estimateGas(tx);
            if (gasEstimate.gt(gasBalance)) {
              setLoading(false);
              setError('Not enough gas for this transaction');
              setLoadingStage('');
              return;
            }
            // Sending ether
            const _submitted = await wallet.sendTransaction({ ...tx, gasLimit: gasEstimate, gasPrice: (await wallet.getGasPrice()).mul(2) });

            setLoadingStage('confirm');
            const result = await waitForTransaction(provider, _submitted);

            // Send event to Mixpanel
            mixpanel.track("core_action", { "page": "Send Token", "action": "Token Sent", "wallet": wallet.address });

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
    const runAsyncBTC = async () => {
      try {
        if (address.length > 0 && validateAddress(address) !== null) {
          setLoadingStage('send')
          if (selectedToken.type === "token" && wallet.address) {
            setLoading(false);
            setError('Xucre does not currently support Runes')
            setLoadingStage('')
          } else if (selectedToken.type === "coin" && wallet.address) {
            const bitcoinWallet = ethereumToBitcoinWallet(_wallet);
            const walletAddress = bitcoinWallet.toAddress().toString();
            //const walletAddress = 'bc1q5g8qcrgsgpglgu56a95dyv6vksapsjpr5e8ncy';
            const _utxos = await getUTXOs(walletAddress);
            let index = -1;
            Promise.allSettled(_utxos.map(async (utxo: any) => {
              //console.log(utxo.txid);
              const _utxoTransactions = await getRawTransaction(utxo.tx_hash);
              //console.log('raw utxo transactions', _utxoTransactions);
              const _utxoTransaction = _utxoTransactions.outputs.find((tx: any) => tx.addresses.includes(walletAddress));

              //console.log('raw utxo transaction', _utxoTransaction);
              index++;
              return {
                txid: utxo.tx_hash,
                outputIndex: index,
                address: walletAddress,
                satoshis: utxo.value,
                //script: utxo.script,
                script: _utxoTransaction.script,
              };
            })).then(async (result) => {
              const utxos = result.map((res: any) => res.value);

              const feePerByteData = await getFees();
              //console.log(feePerByteData.halfHourFee)
              const transaction = await constructBitcoinTransaction(bitcoinWallet, address, ethers.utils.parseEther(amount), utxos, feePerByteData.halfHourFee as number);
              if (transaction) {
                //console.log(transaction.outputs);
                //console.log(transaction.serialize());
                const sendResult = await sendBitcoin(transaction.serialize());
                //console.log(submittedTransactions);
                //Whatsapp Integration
                if (sendResult) {
                  if (checkValues) {
                    //openPage('SendNotificationToken', amount, address, selectedToken.name, 'send')
                  }
                  navigation.navigate("ViewWallet");
                } else {
                  setLoading(false);
                  setError('Error sending transaction')
                  setLoadingStage('')
                }

              }
              setLoading(false);
              setError('');
              setLoadingStage('');
            });

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
        console.log('catch in SendToken', err);
        setLoading(false);
        setError('Error Processing');
        setLoadingStage('')
      }
    };
    setLoading(true);
    setTimeout(() => {
      if (selectedToken.chainId !== 20090103) runAsync();
      if (selectedToken.chainId === 20090103) runAsyncBTC();
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
                        leftIcon={<TokenIcon token={_token} />}
                      />
                    );
                  })}
                </Select>
                <Input
                  style={
                    colorMode === "dark" ? styles.textoImput : lightStyles.textoImput
                  }
                  fontSize={35}
                  inputMode="numeric"
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
                <Box w={'5/6'}>
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
