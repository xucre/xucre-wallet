/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from "array-shuffle";
import { ethers } from "ethers";
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  Drawer,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  KeyboardAvoidingView,
  MoonIcon,
  Pressable,
  ScrollView,
  Stack,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  View,
  VStack,
} from "native-base";
import {
  background,
  color,
} from "native-base/lib/typescript/theme/styled-system";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, { createRef, useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState, useSetRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import DashboardLayout from "../../layouts/DashboardLayout";
import { language as stateLanguage, walletList } from "../../service/state";
import {
  generateMnemonics,
  loadWalletFromMnemonics,
} from "../../service/wallet";
import { storeWallet } from "../../store/wallet";

export default function CreateWallet({ navigation, route, storage }) {
  const setWalletList = useSetRecoilState(walletList);
  const [language] = useRecoilState(stateLanguage);
  const [steps, setSteps] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mnemonics, setMnemonics] = useState([]);
  const [scrambledMnemonics, setScrambledMnemonics] = useState([]);
  const [confirmMnemonics, setConfirmMnemonics] = useState([]);
  const [mnemonicMatchError, setMnemonicMatchError] = useState(false);
  const [mnemonicMatchComplete, setMnemonicMatchComplete] = useState(false);
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
        console.log("generateMnemonics(" + language + ")");
        const _mnemonics = generateMnemonics(language);
        //console.log(_mnemonics);

        setSteps(steps + 1);
        setMnemonics(_mnemonics);
        setScrambledMnemonics(arrayShuffle(_mnemonics));
        setLoading(false);
        // only used for testing
        //setConfirmMnemonics(_mnemonics);
        //setMnemonicMatchComplete(true);
      }, 100);
    };
    const createMnemonics = () => {
      setLoading(true);
      runCreateAsync();
    };

    return (
      <Center marginBottom={20} h={"3/4"} w={"full"}>
        <Heading
          style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
          py={2}
        >
          {translations[language].CreateWallet.instructions_newWwallet}
        </Heading>
        <Text
          style={{
            color: Color.gray_100,
            textAlign: "center",
          }}
          fontSize={"md"}
          py={5}
        >
          {translations[language].CreateWallet.instructions}
        </Text>
        <Button
          w={'full'}
          style={styles.buttonContainer}
          colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
          onPress={createMnemonics}
          isLoading={loading}
        >
          <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white }}>
            {translations[language].CreateWallet.instructions_button}
          </Text>
        </Button>
      </Center>
    );
  }

  function MnemonicList() {
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
          {translations[language].CreateWallet.mnemonic_instructions}
        </Text>
        <Grid
          style={{
            paddingBottom: 10,
          }}
        >
          <Col>
            {mnemonics.map((val, i) => {
              if (i % 3 === 0) {
                return (
                  <VStack key={val}>
                    <Badge
                      colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                      rounded="full"
                      mb={-4}
                      mr={11}
                      zIndex={100}
                      variant="solid"
                      alignSelf="flex-start"
                      _text={{
                        fontSize: 12,
                      }}
                    >
                      <Text style={{color : colorMode === 'dark' ? Color.black : Color.white}}>{i + 1}</Text>
                    </Badge>
                    <Button
                      left={0}
                      width={100}
                      height={50}
                      bg="Color.gray_100"
                      rounded="sm"
                      _text={{
                        color: Color.gray_200,
                        fontWeight: "medium",
                      }}
                      margin={1}
                      shadow={"3"}
                      key={val}
                    >
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
            {mnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <VStack key={val}>
                    <Badge
                      colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                      rounded="full"
                      mb={-4}
                      mr={11}
                      zIndex={100}
                      variant="solid"
                      alignSelf="flex-start"
                      _text={{
                        fontSize: 12,
                      }}
                    >
                      <Text style={{color : colorMode === 'dark' ? Color.black : Color.white}}>{i + 1}</Text>
                    </Badge>
                    <Button
                      width={100}
                      height={50}
                      bg="Color.gray_100"
                      rounded="sm"
                      _text={{
                        color: "warmGray.50",
                        fontWeight: "medium",
                      }}
                      margin={1}
                      shadow={"3"}
                      key={val}
                    >
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
            {mnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <VStack key={val}>
                    <Badge
                      colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                      rounded="full"
                      mb={-4}
                      mr={11}
                      zIndex={100}
                      variant="solid"
                      alignSelf="flex-start"
                      _text={{
                        fontSize: 12,
                      }}
                    >
                      <Text style={{color : colorMode === 'dark' ? Color.black : Color.white}}>{i + 1}</Text>
                    </Badge>
                    <Button
                      right={0}
                      width={100}
                      height={50}
                      bg="Color.gray_100"
                      rounded="sm"
                      _text={{
                        color: "warmGray.50",
                        fontWeight: "medium",
                      }}
                      margin={1}
                      shadow={"3"}
                      key={val}
                    >
                      <Text>{val}</Text>
                    </Button>
                  </VStack>
                );
              }
            })}
          </Col>
          <Col></Col>
        </Grid>
      </Box>
    );
  }

  function ConfirmMnemonicList() {
    const selectMnemonic = (word) => {
      setConfirmMnemonics([...confirmMnemonics, word]);
    };
    const removeMnemonic = (word) => {
      const filteredList = confirmMnemonics.filter((val) => {
        return val !== word;
      });
      setConfirmMnemonics(filteredList);
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
          {translations[language].CreateWallet.mnemonic_instructions}
        </Text>

        <Grid
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Col>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 0) {
                return (
                  <Box alignItems="center" key={val + i}>
                    <VStack>
                      {confirmMnemonics.includes(val) && (
                        <Pressable
                          onPress={() => {
                            removeMnemonic(val);
                          }}
                          zIndex={1000}
                        >
                          <Badge
                            colorScheme={colorMode === 'dark' ? 'warmGray' : 'coolGray'}
                            rounded="full"
                            mb={-4}
                            mr={-1}
                            zIndex={1000}
                            variant="solid"
                            alignSelf="flex-end"
                            _text={{
                              fontSize: 12,
                            }}
                          >
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      )}
                      {confirmMnemonics.includes(val) && (
                        <Badge
                          colorScheme={colorMode === 'dark' ? "primary.400" : 'tertiary'}
                          rounded="full"
                          mb={-4}
                          mr={11}
                          zIndex={100}
                          variant="solid"
                          alignSelf="flex-start"
                          _text={{
                            fontSize: 12,
                          }}
                        >
                          <Text color={colorMode === 'dark' ? Color.black : Color.white}>{confirmMnemonics.indexOf(val) + 1}</Text>
                        </Badge>
                      )}

                      <Button
                        width={100}
                        height={50}
                        colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                        bg="Color.gray_100"
                        rounded="sm"
                        _text={{
                          color: "warmGray.50",
                          fontWeight: "medium",
                        }}
                        _hover={{
                          color: "warmGray.800"
                        }}
                        margin={1}
                        shadow={"3"}
                        key={val}
                        onPress={() => {
                          selectMnemonic(val);
                        }}
                        disabled={confirmMnemonics.includes(val)}
                      >
                        <Text>{val}</Text>
                      </Button>
                    </VStack>
                  </Box>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 1) {
                return (
                  <Box alignItems="center" key={val + i}>
                    <VStack>
                      {confirmMnemonics.includes(val) && (
                        <Pressable
                          onPress={() => {
                            removeMnemonic(val);
                          }}
                          zIndex={1000}
                        >
                          <Badge
                            colorScheme={colorMode === 'dark' ? 'warmGray' : 'coolGray'}
                            rounded="full"
                            mb={-4}
                            mr={-1}
                            zIndex={10000}
                            variant="solid"
                            alignSelf="flex-end"
                            _text={{
                              fontSize: 12,
                            }}
                          >
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      )}
                      {confirmMnemonics.includes(val) && (
                        <Badge
                          colorScheme={colorMode === 'dark' ? "primary.400" : 'tertiary'}
                          rounded="full"
                          mb={-4}
                          mr={11}
                          zIndex={100}
                          variant="solid"
                          alignSelf="flex-start"
                          _text={{
                            fontSize: 12,
                          }}
                        >
                          <Text color={colorMode === 'dark' ? Color.black : Color.white}>{confirmMnemonics.indexOf(val) + 1}</Text>
                        </Badge>
                      )}

                      <Button
                        width={100}
                        height={50}
                        colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                        bg="Color.gray_100"
                        rounded="sm"
                        _text={{
                          color: "warmGray.50",
                          fontWeight: "medium",
                        }}
                        _hover={{
                          color: "warmGray.800"
                        }}
                        margin={1}
                        shadow={"3"}
                        key={val}
                        onPress={() => {
                          selectMnemonic(val);
                        }}
                      >
                        <Text>{val}</Text>
                      </Button>
                    </VStack>
                  </Box>
                );
              }
            })}
          </Col>
          <Col></Col>
          <Col>
            {scrambledMnemonics.map((val, i) => {
              if (i % 3 === 2) {
                return (
                  <Box alignItems="center" key={val + i}>
                    <VStack>
                      {confirmMnemonics.includes(val) && (
                        <Pressable
                          onPress={() => {
                            removeMnemonic(val);
                          }}
                          zIndex={1000}
                        >
                          <Badge
                            colorScheme={colorMode === 'dark' ? 'warmGray' : 'coolGray'}
                            rounded="full"
                            mb={-4}
                            mr={0}
                            zIndex={10000}
                            variant="solid"
                            alignSelf="flex-end"
                            _text={{
                              fontSize: 12,
                            }}
                          >
                            <CloseIcon />
                          </Badge>
                        </Pressable>
                      )}
                      {confirmMnemonics.includes(val) && (
                        <Badge
                          colorScheme={colorMode === 'dark' ? "primary.400" : 'tertiary'}
                          rounded="full"
                          mb={-4}
                          mr={11}
                          zIndex={100}
                          variant="solid"
                          alignSelf="flex-start"
                          _text={{
                            fontSize: 12,
                          }}
                        >
                          <Text color={colorMode === 'dark' ? Color.black : Color.white}>{confirmMnemonics.indexOf(val) + 1}</Text>
                        </Badge>
                      )}

                      <Button
                        width={100}
                        height={50}
                        colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
                        bg="Color.gray_100"
                        rounded="sm"
                        _text={{
                          color: "warmGray.50",
                          fontWeight: "medium",
                        }}
                        _hover={{
                          color: "warmGray.800"
                        }}
                        margin={1}
                        shadow={"3"}
                        key={val}
                        onPress={() => {
                          selectMnemonic(val);
                        }}
                      >
                        <Text>{val}</Text>
                      </Button>
                    </VStack>
                  </Box>
                );
              }
            })}
          </Col>
        </Grid>
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
                {translations[language].CreateWallet.mnemonic_error}
              </Text>
            </Center>
          </Alert>
        )}
        {mnemonicMatchComplete && (
          <Button w={'full'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={nextStep}>
            <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }}>
              {translations[language].CreateWallet.mnemonic_error_button}
            </Text>
          </Button>
        )}
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

  const handleChange = (event) => {
    //console.log(event.nativeEvent.text);
    setName(event.nativeEvent.text);
  };

  function nextStep() {
    setSteps(steps + 1);
  }

  const saveWallet = () => {
    const runAsync = async () => {
      if (confirmMnemonics.length > 0 && name.length > 0) {
        console.log("save your wallet");
        const _wallet = await loadWalletFromMnemonics(confirmMnemonics);
        //console.log(_wallet.privateKey, name);

        await storeWallet({ name, wallet: _wallet.privateKey });
        setWalletList((oldWalletList) => [
          ...oldWalletList,
          {
            address: _wallet.address,
            name,
            wallet: _wallet,
          },
        ]);
        setLoading(false);
        setTimeout(() => {
          navigation.navigate("SelectWallet");
        }, 100);
      }
    };
    setLoading(true);
    setTimeout(() => {
      runAsync();
    }, 100);
  };

  return (
    <Center style={{ backgroundColor: colorMode === 'dark' ? Color.gray_200 : Color.white }} flex={1} px="3">
      <KeyboardAvoidingView h={{
        base: "auto",
        lg: "auto"
      }} behavior={Platform.OS === "ios" ? "padding" : "height"} py={10}>
        {steps === 0 && 
          <Box>
            <Instructions></Instructions>
          </Box>
        }

        {steps === 1 && (
          <Box
            alignItems="center"
          >
            <Center marginBottom={20} h={"3/4"} w={"full"} alignItems="center" flex="1" justifyContent="space-between">
              
              <Heading
                style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
                py={2}
              >
                {translations[language].CreateWallet.mnemonic_confirm_instructions}
              </Heading>
              <MnemonicList></MnemonicList>
              <Box>
                <Stack >
                  <Button w={'full'} style={styles.buttonContainer} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={nextStep}>
                    <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }}>
                      {translations[language].CreateWallet.mnemonic_confirm_button}
                    </Text>
                  </Button>
                </Stack>
              </Box>
            </Center>
          </Box>
        )}

        {steps === 2 && (
          <Box
          alignItems="center"
          >
          <Center marginBottom={0} h={"3/4"} w={"full"} alignItems="center" flex="1" justifyContent="space-between" _text={{ color: "warmGray.50", fontWeight: "medium" }}>
            <Heading
              style={{ color: colorMode === 'dark' ? Color.white : Color.gray_200, fontWeight: "bold" }}
              py={2}
            >
              {translations[language].CreateWallet.mnemonic_confirm_instructions}
            </Heading>
            <ConfirmMnemonicList></ConfirmMnemonicList>
            <MnemonicError></MnemonicError>
          </Center>
          </Box>
        )}

        {steps === 3 && (
          <Center
            alignItems="center"
          >
            <Text
              style={{ color: colorMode === 'dark' ? Color.white : Color.black, fontWeight: "bold" }}
              fontSize={"lg"}
              mt={5}
            >
              {translations[language].CreateWallet.name_wallet}
            </Text>
            <Text
              style={{
                color: Color.gray_100,
                marginLeft: 15,
                marginRight: 15,
                textAlign: "center",
              }}
              fontSize={"md"}
              my={5}
            >
              {translations[language].CreateWallet.instructions_nameWallet}
            </Text>
            <Input
              w="full"
              value={name}
              onChange={handleChange}
              placeholder={
                translations[language].CreateWallet.name_entry_input_placeholder
              }
            />
            <Button
              style={styles.buttonContainer}
              onPress={() => {
                saveWallet();
              }}
              isLoading={loading}
              isLoadingText={
                translations[language].CreateWallet
                  .name_entry_button_loadingtext
              }
              my={5}
              w={'full'}
              disabled={
                confirmMnemonics.length < mnemonics.length || name.length === 0
              }
              colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            >
              <Text style={{ color: colorMode === 'dark' ? Color.black : Color.white, fontWeight: "bold" }} textAlign={'center'}>
                {translations[language].CreateWallet.name_entry_button}
              </Text>
            </Button>
          </Center>
        )}
      </KeyboardAvoidingView>
    </Center>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: "bold",
  },

  createANew: {
    color: Color.darkgray_100,
    fontFamily: FontFamily['interRegular'],
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
    borderRadius: Border.br_sm,
    fontFamily: FontFamily['interSemibold'],
  },
  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily['interSemibold'],
    fontWeight: "600",
  },
  yourWallet: {
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  },
});
