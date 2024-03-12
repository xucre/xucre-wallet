
import arrayShuffle from "array-shuffle";
import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Input,
  KeyboardAvoidingView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";

import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { AppWallet, language as stateLanguage, walletList } from "../../service/state";
import {
  generateMnemonics,
  loadWalletFromMnemonics,
} from "../../service/wallet";
import { storeWallet, WalletInternal } from '../../store/wallet';
import { Wallet } from "ethers";

export default function CreateWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const setWalletList = useSetRecoilState(walletList);
  const [language] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mnemonics, setMnemonics] = useState([] as string[]);
  const [scrambledMnemonics, setScrambledMnemonics] = useState([] as string[]);
  const [confirmMnemonics, setConfirmMnemonics] = useState([] as string[]);
  const [mnemonicMatchError, setMnemonicMatchError] = useState(false);
  const [mnemonicMatchComplete, setMnemonicMatchComplete] = useState(false);
  const [exportWallet, setExportWallet] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    };
  }, []);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (confirmMnemonics.length > 0) {
      const isMatching = confirmMnemonics.map((current, i) => {
        return current === mnemonics[i];
      });
      setMnemonicMatchError(isMatching.includes(false));
      if (
        !isMatching.includes(false) &&
        confirmMnemonics.length === mnemonics.length
      ) {
        setMnemonicMatchComplete(true);
      } else {
        setMnemonicMatchComplete(false);
      }
    } else {
      setMnemonicMatchError(false);
    }
  }, [confirmMnemonics]);

  function Instructions() {
    const runCreateAsync = async () => {
      // test
      setTimeout(() => {
        const _mnemonics = generateMnemonics(language);

        setSteps(steps + 1);
        setMnemonics(_mnemonics);
        setScrambledMnemonics(arrayShuffle(_mnemonics));
        setLoading(false);
        // only used for testing
        if (process.env.DEV) {
          setConfirmMnemonics(_mnemonics);
          setMnemonicMatchComplete(true);
        }
      }, 100);
    };
    const createMnemonics = () => {
      setLoading(true);
      runCreateAsync();
    };

    return (
      <VStack h={'container'} marginBottom={20} justifyContent={'space-around'} w={"full"} alignItems={'center'}>
        <Heading
          style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
          py={2}
        >
          {translations[language as keyof typeof translations].CreateWallet.instructions_newWwallet}
        </Heading>
        <Text
          style={{
            color: colorMode === 'dark' ? Color.white : Color.black,
            textAlign: "center",
          }}
          fontSize={"md"}
          py={5}
        >
          {translations[language as keyof typeof translations].CreateWallet.instructions}
        </Text>
        <Button
          width={'90%'}
          style={styles.buttonContainer}
          colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
          onPress={createMnemonics}
          isLoading={loading}
        >
          <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white }}>
            {translations[language as keyof typeof translations].CreateWallet.instructions_button}
          </Text>
        </Button>
      </VStack>
    );
  }

  function MnemonicList() {
    function ListItem({ value, index }: { value: string, index: number }) {
      return (
        <Button
          width={'full'}
          bg={Color.gray_300}
          rounded="lg"
          _text={{
            alignContent: 'center',
            color: colorMode === 'dark' ? Color.white : Color.gray_200,
            fontWeight: "medium",
            justifyContent: 'center',
          }}
          variant={'unstyled'}
          alignSelf={'center'}
          margin={1}
          alignItems={'center'}
          justifyContent={'flex-start'}
          startIcon={
            <Badge
              colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
              rounded="full"
              zIndex={100}
              variant="solid"
              alignSelf="flex-start"
              _text={{
                fontSize: 10,
              }}
              margin={1}
            >
              <Text style={{
                color: colorMode === 'dark' ? Color.black : Color.white,
              }}>{index + 1}</Text>
            </Badge>
          }
        >
          <Text style={{ color: Color.white }}>{value}</Text>
        </Button>
      )
    };
    return (
      <Box>
        <Text
          style={{
            color: Color.gray_100,
            marginLeft: 15,
            marginRight: 15,
            textAlign: "center",
          }}
          fontSize={"md"}
          my={2}
        >
          {translations[language as keyof typeof translations].CreateWallet.mnemonic_instructions}
        </Text>
        <HStack space={2}
          style={{
            paddingBottom: 10,
          }}
        >
          <VStack space={2} alignItems="center">
            {mnemonics.map((val, i) => {
              if (i % 3 === 0) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
          <VStack space={2} alignItems="center">
            {mnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
          <VStack space={2} alignItems="center">
            {mnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
        </HStack>
      </Box>
    );
  }

  function ConfirmMnemonicList() {
    const selectMnemonic = (word: string) => {
      setConfirmMnemonics([...confirmMnemonics, word]);
    };
    const removeMnemonic = (word: string) => {
      const filteredList = confirmMnemonics.filter((val) => {
        return val !== word;
      });
      setConfirmMnemonics(filteredList);
    };
    function ListItem({ value, index }: { value: string, index: number }) {
      return (
        <Button
          width={'full'}
          bg={Color.gray_300}
          rounded="lg"
          _text={{
            alignContent: 'center',
            color: Color.gray_200,
            fontWeight: "medium",
            justifyContent: 'center',
          }}
          variant={'unstyled'}
          alignSelf={'center'}
          margin={1}
          alignItems={'center'}
          justifyContent={'flex-start'}

          onPress={() => {
            if (confirmMnemonics.includes(value)) {
              removeMnemonic(value);
            } else {
              selectMnemonic(value);
            }
          }}
          startIcon={
            confirmMnemonics.includes(value) ?
              <Badge
                colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                rounded="full"
                zIndex={100}
                variant="solid"
                alignSelf="flex-start"
                _text={{
                  fontSize: 10,
                }}
                margin={1}
              >
                <Text style={{
                  color: colorMode === 'dark' ? Color.black : Color.white,
                }}>{confirmMnemonics.indexOf(value) + 1}</Text>
              </Badge> :
              <Badge
                backgroundColor={'transparent'}
                rounded="full"
                zIndex={100}
                variant="solid"
                alignSelf="flex-start"
                _text={{
                  fontSize: 10,
                }}
                marginY={1}
              >
                <Text style={{
                  color: 'transparent',
                }}></Text>
              </Badge>
          }
        >
          <Text style={{ color: Color.white }}>{value}</Text>
        </Button>
      )
    };
    return (
      <>
        <Text
          style={{
            color: Color.gray_100,
            marginLeft: 15,
            marginRight: 15,
            textAlign: "center",
          }}
          fontSize={"md"}
          mt={5}
        >
          {translations[language as keyof typeof translations].CreateWallet.mnemonic_instructions}
        </Text>

        <HStack
          space={2}
          style={{
            paddingBottom: 10,
          }}
        >
          <VStack space={2} alignItems="center" justifyItems={'center'}>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 0) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
          <VStack space={2} alignItems="center" justifyItems={'center'}>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
          <VStack space={2} alignItems="center" justifyItems={'center'}>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <ListItem value={val} index={i} key={i} />
                );
              }
            })}
          </VStack>
        </HStack>
      </>
    );
  }

  function MnemonicError() {
    return (
      <>
        {mnemonicMatchError && (
          <Alert w="100%" status={"error"}>
            <Center>
              <Text color="coolGray.800">
                {translations[language as keyof typeof translations].CreateWallet.mnemonic_error}
              </Text>
            </Center>
          </Alert>
        )}
        {mnemonicMatchComplete && (
          <Button width={'90%'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={nextStep}>
            <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }}>
              {translations[language as keyof typeof translations].CreateWallet.mnemonic_error_button}
            </Text>
          </Button>
        )}
        {!mnemonicMatchError && !mnemonicMatchComplete &&
          <Box minH={15} my={4}></Box>
        }
      </>
    );
  }

  function WalletName() {
    return (
      <>
        <Box alignItems="center">
          <Input
            w="100%"
            value={name}
            onChange={handleChange}
            placeholder="Set Wallet Name"
          />
        </Box>
      </>
    );
  }

  const handleChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setName(event.nativeEvent.text);
  };

  function nextStep() {
    setSteps(steps + 1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      if (confirmMnemonics.length > 0 && name.length > 0) {
        const _wallet = await loadWalletFromMnemonics(confirmMnemonics);
        const walletInternal = {
          address: _wallet.address,
          name,
          wallet: _wallet.privateKey,
        } as AppWallet;
        await storeWallet(walletInternal);
        setWalletList((oldWalletList) => [
          ...oldWalletList,
          walletInternal
        ]);
        setLoading(false);
        setTimeout(() => {
          if (exportWallet) {
            navigation.navigate('ExportWallet', { address: _wallet.address })
          } else {
            navigation.navigate("SelectWallet");
          }
        }, 100);
      }
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
  };

  function Stepper() {
    return (
      <HStack space={0} alignItems={'center'} justifyContent={'center'} w={'2/5'}>
        {steps === 0 ?
          <Badge
            colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            rounded="full"
            zIndex={100}
            variant="solid"
            alignSelf="flex-start"
            _text={{
              fontSize: 10,
            }}
            margin={1}
          >
            <Text style={{
              color: colorMode === 'dark' ? Color.black : Color.white,
            }}>{steps + 1}</Text>
          </Badge> :
          <Badge variant={'solid'} w={3} h={3} p={1} rounded="full"></Badge>
        }

        <Divider orientation={'horizontal'} w={'1/3'} />
        {steps === 1 ?
          <Badge
            colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            rounded="full"
            zIndex={100}
            variant="solid"
            alignSelf="flex-start"
            _text={{
              fontSize: 10,
            }}
            margin={1}
          >
            <Text style={{
              color: colorMode === 'dark' ? Color.black : Color.white,
            }}>{steps + 1}</Text>
          </Badge> :
          <Badge variant={'solid'} w={3} h={3} p={1} rounded="full"></Badge>
        }
        <Divider orientation={'horizontal'} w={'1/3'} />
        {steps === 2 ?
          <Badge
            colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            rounded="full"
            zIndex={100}
            variant="solid"
            alignSelf="flex-start"
            _text={{
              fontSize: 10,
            }}
            margin={1}
          >
            <Text style={{
              color: colorMode === 'dark' ? Color.black : Color.white,
            }}>{steps + 1}</Text>
          </Badge> :
          <Badge variant={'solid'} w={3} h={3} p={1} rounded="full"></Badge>
        }
      </HStack>
    )
  }

  return (
    <Box style={{ backgroundColor: colorMode === 'dark' ? Color.black : Color.white }} flex={1} px="3" h={'full'}>
      <KeyboardAvoidingView h={{
        base: "auto",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"} py={10}>
        <Center>
          <Stepper />
        </Center>
        {steps === 0 &&

          <Instructions></Instructions>

        }

        {steps === 1 && (
          <Box
            alignItems="center"
          >
            <VStack marginBottom={0} w={"full"} alignItems="center" justifyContent="space-between" _text={{ color: "warmGray.50", fontWeight: "medium" }}>
              <Heading
                style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
                py={2}
              >
                {translations[language as keyof typeof translations].CreateWallet.mnemonic_confirm_instructions}
              </Heading>
              <MnemonicList></MnemonicList>
              <Box>
                <Button.Group >
                  <Button mx={5} width={'90%'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={nextStep}>
                    <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }}>
                      {translations[language as keyof typeof translations].CreateWallet.mnemonic_confirm_button}
                    </Text>
                  </Button>
                </Button.Group>
              </Box>
            </VStack>
          </Box>
        )}

        {steps === 2 && (
          <Box
            alignItems="center"
          >
            <VStack marginBottom={0} w={"full"} alignItems="center" justifyContent="space-between" _text={{ color: "warmGray.50", fontWeight: "medium" }}>
              <Heading
                style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
                py={2}
              >
                {translations[language as keyof typeof translations].CreateWallet.mnemonic_confirm_instructions}
              </Heading>
              <ConfirmMnemonicList></ConfirmMnemonicList>
              <MnemonicError></MnemonicError>
            </VStack>
          </Box>
        )}

        {steps === 3 && (
          <VStack
            alignItems="center"
            w={'full'}
            justifyContent={'space-around'}
          >
            <Text
              style={{ color: colorMode === 'dark' ? Color.white : Color.black, fontWeight: "bold" }}
              fontSize={"lg"}
              mt={5}
            >
              {translations[language as keyof typeof translations].CreateWallet.name_wallet}
            </Text>
            <Text
              style={{
                color: Color.gray_100,
                marginLeft: 15,
                marginRight: 15,
                textAlign: "center",
              }}
              fontSize={"md"}
              mt={5}

            >
              {translations[language as keyof typeof translations].CreateWallet.instructions_nameWallet}
            </Text>
            <Input
              w="90%"
              my={10}
              value={name}
              onChange={handleChange}
              placeholder={
                translations[language as keyof typeof translations].CreateWallet.name_entry_input_placeholder
              }
            />
            <HStack space={6}>
              <Checkbox shadow={2} value={exportWallet.toString()} accessibilityLabel="Add key to Google Wallet" >
                <Text style={{
                  color: colorMode === 'dark' ? Color.white : Color.black,
                }}>{translations[language as keyof typeof translations].CreateWallet.add_to_google}</Text>
              </Checkbox>
            </HStack>
            <Button
              style={styles.buttonContainer}
              onPress={() => {
                saveWallet();
              }}
              isLoading={loading}
              isLoadingText={
                translations[language as keyof typeof translations].CreateWallet
                  .name_entry_button_loadingtext
              }
              my={4}

              width={'90%'}
              disabled={
                confirmMnemonics.length < mnemonics.length || name.length === 0
              }
              colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            >
              <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }} textAlign={'center'}>
                {translations[language as keyof typeof translations].CreateWallet.name_entry_button}
              </Text>
            </Button>
          </VStack>
        )}
      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 100,
    borderStyle: "solid",
    fontWeight: "bold",
  },

  createANew: {
    color: Color.darkgray_100,
    fontFamily: FontFamily['interRegular' as keyof typeof FontFamily],
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
    textAlign: "center",
  },
  createFlexBox: {
    letterSpacing: -0.2,
    textAlign: "center",
  },
  rectangleGroup: {
    backgroundColor: Color.gray_200,
  },
  rectangleLayout: {
  },
  rectangleParent: {
    backgroundColor: "#CEF213",
    borderRadius: 100,
    fontFamily: FontFamily['interSemibold' as keyof typeof FontFamily],
  },
  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily['interSemibold' as keyof typeof FontFamily],
    fontWeight: "600",
  },
  yourWallet: {
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  },
});