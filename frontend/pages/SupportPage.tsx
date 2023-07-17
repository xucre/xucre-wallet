/* eslint-disable sort-keys */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable import/order */
//import LIFI, {ChainId} from '@lifi/sdk';
import { ethers, getDefaultProvider, providers, Wallet } from "ethers";
import {
  Box,
  Input,
  KeyboardAvoidingView,
  Text,
  TextArea,
  View,
  VStack,
  useColorMode,
  useColorModeValue,
  Center,
} from "native-base";
import { Button } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../frontend/service/state";
import sendEmail from "../service/sendEmail";
import { twillioEmail } from "../service/twillioEmail";
import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import sendgrid from "@sendgrid/mail";

import translations from "../assets/translations";

export default function SuportPage({ navigation, route }) {

  const [language] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [name, setName] = useState("");
  const [issue, setIssue] = useState("");
  const [toEmail, setToEmail] = useState("");

  const handleNameChange = (event) => {
    //console.log(event.nativeEvent.text);
    setName(event.nativeEvent.text);
  };

  const handleIssueChange = (event) => {
    //console.log(event.nativeEvent.text);
    setIssue(event.nativeEvent.text);
  };

  const handletoEmailChange = (event) => {
    //console.log(event.nativeEvent.text);
    setToEmail(event.nativeEvent.text);
  };

  const viewWallet = () => {
    navigation.navigate('ViewWallet');
  }
  

  return (
    <Center
      style={{
        backgroundColor: colorMode === "dark" ? Color.gray_200 : Color.white,
      }}
      flex={1}
      px="3"
    >
      <KeyboardAvoidingView
        h={{
          base: "800px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <VStack
          minW="300px"
          w="100%"
          alignItems="center"
          flex="1"
          justifyContent="space-between"
          marginBottom={20}
          marginTop={20}
        >
          
            <Text fontSize="2xl" bold mb={"1"} pt={1} >
                {translations[language].SupportPage.title}
            </Text>
            <Text fontSize="sm" mb={"1"} pt={1} >
                {translations[language].SupportPage.introduction}
              </Text>
             <Text fontSize="xs" mb={"1"} pt={1} >
                {translations[language].SupportPage.to_send}
              </Text>
             <Input
                  style={
                    colorMode === "dark"
                      ? styles.textoImput
                      : lightStyles.textoImput
                  }
                  fontSize={12}
                  w="90%"
                  h="10%"
                  mb={4}
                  value={toEmail}
                  onChange={handletoEmailChange}
                  placeholderTextColor={colorMode === "dark" ? Color.white : Color.black}
                  w="90%"
                  mb={1}
                  placeholder={translations[language].SupportPage.to_send}
                />

                    <Text fontSize="xs" mb={"1"} pt={1}>
                      {translations[language].SupportPage.subject_send}
                    </Text>
               

                <Input
                  style={
                    colorMode === "dark"
                      ? styles.textoImput
                      : lightStyles.textoImput
                  }
                  fontSize={12}
                  w="90%"
                  h="10%"
                  mb={4}
                  value={name}
                  onChange={handleNameChange}
                  placeholderTextColor={colorMode === "dark" ? Color.white : Color.black}
                  placeholder={translations[language].SupportPage.subject_send}
                />

              
                    <Text fontSize="xs" mb={"1"} pt={1}>
                              {translations[language].SupportPage.describe_issue}
                    </Text>
              
              <Box alignItems="center" w="100%">
                <TextArea h={20} placeholder={translations[language].SupportPage.describe_issue} w="90%" numberOfLines={4} value={issue}
                  onChange={handleIssueChange}/>
              </Box>
              

              <Box>
              <Button
              style={styles.buttonContainer}
              onPress={() =>
                sendEmail(
                  toEmail,
                  name,
                  issue,
                  navigation,
                  translations[language].SupportPage.toast_send
                )
              }
            >
              <Text color={"#000"}>
                {translations[language].SupportPage.button_send}
              </Text>
            </Button>
              </Box>


              <Box>
              <Button
              style={styles.buttonContainer}
              onPress={() =>
                viewWallet()
              }
            >
              <Text color={"#000"}>
                {"Cancel"}
              </Text>
            </Button>
              </Box>





        </VStack>
      </KeyboardAvoidingView>
    </Center>
  );
}

const lightStyles = StyleSheet.create({
    textoImput: {
        backgroundColor: Color.white,
        borderColor: Color.transparent,
        borderRadius: Border.br_xs,
        borderStyle: "solid",
        borderWidth: 1,
    },
});

const styles = StyleSheet.create({
  rectangleParent1: {
    top: 330,
    borderRadius: Border.br_sm,
    backgroundColor: "#D4E815",
    fontFamily: FontFamily.interSemibold,
  },
  rectangleLayout: {
    height: 60,
    width: 330,
    position: "absolute",
    borderColor: "#fff",
  },
  supportxsucrecom: {
    color: Color.white,
  },
  input: {
    top: 192,
    height: 75,
  },
  inputPosition: {
    width: 365,
    position: "absolute",
  },
  inputPosition1: {
    width: 365,
    top: 285,
    position: "absolute",
  },
  rectangleParent: {
    top: 27,
  },
  textoImput: {
    borderRadius: Border.br_xs,
    backgroundColor: Color.gray_300,
    borderColor: "#7b7b7b",
    borderWidth: 1,
    borderStyle: "solid",
    width: 380,
    top: 0,
  },
  buttonContainer: {
    borderColor: Color.transparent,
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderWidth: 1,
    fontWeight: "bold",
  },
});


