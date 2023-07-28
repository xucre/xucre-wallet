/* eslint-disable sort-imports */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable functional/no-let */
/* eslint-disable sort-keys */
/* eslint-disable react-native/no-color-literals */

import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import whatsapp from "./whatsapp";
import { language as stateLanguage } from "../../frontend/service/state";
import translations from "../assets/translations";
import { useRecoilState } from "recoil";
import { Border,Color } from "../../GlobalStyles";
import { Button, useColorMode, Text } from "native-base";
import codeCountry from "../assets/json/codeCountry.json"

const CodeCountry = ({ navigation, route }) => {

  console.log('route code country:', route)

/*   console.log(
    "route ccodeCountry ",
    route.params.param1.phoneNumbers[0].number
  );
 */
  const nn = veri(route.params.param1.phoneNumbers[0].number, route.params.param3.countryCode);

  //console.log("nn", nn);

  const [language] = useRecoilState(stateLanguage);
  const [phoneNumber, setphoneNumber] = useState("");
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const { colorMode } = useColorMode();
  let _final: any;
  const phoneInput = useRef(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const QRWallet = () => {
    navigation.navigate('QRWallet');
  }

  const SendNotificationToken = () => {
    navigation.navigate('SendNotificationToken');
  }

  if (route.params.param4 === "send") {
    const formaterNumberSend = () => {
      const checkValid = phoneInput.current?.isValidNumber(value);
      //console.log("checkValid", checkValid);
      if (!checkValid) {
        let character = "+";
        let phoneNumber = phoneInput.current.state.number;
        let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        /* console.log(
          "getNumberAfterPossiblyEliminatingZero",
          getNumberAfterPossiblyEliminatingZero
        ); */
        let newFormatterNumber = phoneNumber.includes(
          phoneInput.current.state.code
        )
          ? phoneNumber.replace(character + phoneInput.current.state.code, "")
          : getNumberAfterPossiblyEliminatingZero.number;
        //console.log("newFormatterNumber", newFormatterNumber);
        let newNumber = phoneNumber;
        //console.log("newNumber", newNumber);
        _final = phoneInput.current.state.code + newFormatterNumber;
        buttonPressSend();
      }
    };

    const buttonPressSend = async () => {
      const amoutAndName = route.params.param3 + " " + route.params.param5;
      whatsapp(
        _final,
        "shared_notification",
        "en_US",
        { param1: route.params.param2, param2: amoutAndName },
        translations[language].QRWallet.toast_send
      );
      await delay(3000);
      navigation.navigate("ViewWallet");
    };

    return (
      <View style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={nn[0]}
          defaultCode={nn[1]}
          layout="first"
          withShadow
          autoFocus
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInput}
          onChangeFormattedText={(text) => {
            setphoneNumber(text);
          }}
        />


        <Button
          style={styles.buttonContainer}
          mt={4}
          width={"3/4"}
          colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
          onPress={() => {
            formaterNumberSend();
          }}
        >
          <Text color={colorMode === "dark" ? Color.black : Color.white}>
          {translations[language].WhatsAppNotification.Send_Button}
            </Text>
        </Button>

        <Button
          style={styles.buttonContainer}
          mt={4}
          width={"3/4"}
          colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
          onPress={SendNotificationToken}
        >
          <Text color={colorMode === "dark" ? Color.black : Color.white}>
          {translations[language].SupportPage.button_cancel}
          </Text>
        </Button>
      </View>
    );
  } else {
    const buttonPress = async () => {
      whatsapp(
        _final,
        "shareqrcode",
        "en_US",
        { param1: "www.google.com", param2: route.params.param2 },
        translations[language].QRWallet.toast_send
      );
      await delay(3000);
      navigation.navigate("QRWallet");
    };

    const formaterNumber = () => {
      const checkValid = phoneInput.current?.isValidNumber(value);
      //console.log("checkValid", checkValid);
      if (!checkValid) {
        let character = "+";
        let phoneNumber = phoneInput.current.state.number;
        let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        /* console.log(
          "getNumberAfterPossiblyEliminatingZero",
          getNumberAfterPossiblyEliminatingZero
        ); */
        let newFormatterNumber = phoneNumber.includes(
          phoneInput.current.state.code
        )
          ? phoneNumber.replace(character + phoneInput.current.state.code, "")
          : getNumberAfterPossiblyEliminatingZero.number;
        //console.log("newFormatterNumber", newFormatterNumber);
        let newNumber = phoneNumber;
        //console.log("newNumber", newNumber);
        _final = phoneInput.current.state.code + newFormatterNumber;
        buttonPress();
      }
    };

    return (
      <View style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={nn[0]}
          defaultCode={nn[1]}
          layout="first"
          withShadow
          //autoFocus
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInput}
          onChangeFormattedText={(text) => {
            setphoneNumber(text);
          }}
        />

        <Button
          style={styles.buttonContainer}
          mt={4}
          width={"3/4"}
          colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
          onPress={() => {
            formaterNumber();
          }}
        >
          <Text color={colorMode === "dark" ? Color.black : Color.white}>
          {translations[language].WhatsAppNotification.Send_Button}
            </Text>
        </Button>

        <Button
          style={styles.buttonContainer}
          mt={4}
          width={"3/4"}
          colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
          onPress={QRWallet}
        >
          <Text color={colorMode === "dark" ? Color.black : Color.white}>
          {translations[language].SupportPage.button_cancel}
          </Text>
        </Button>

      </View>
    );
  }
};

function veri(number: string, cCountry: string) {

  let countryCode = codeCountry
  let currentPhoneNumber = ""
  let codeCountryIso2 = ""
  let myArray = []

  if (number.includes("+")) {
    let str = number.slice(1)
    for (let i = 0; i < countryCode.length; i++) {
      let lc = countryCode[i].phone_code.length
      if (str.substring(0, lc) === countryCode[i].phone_code) {
        currentPhoneNumber = str.substring(lc);
        codeCountryIso2 = countryCode[i].iso2
        myArray = [currentPhoneNumber,codeCountryIso2];
        return myArray;
      }
    }
  
  } else if(!number.includes("+")){
    for (let i = 0; i < countryCode.length; i++) {
      let lc = countryCode[i].phone_code.length
      if (number.substring(0, lc) === countryCode[i].phone_code) {
        currentPhoneNumber = number.substring(lc);
        codeCountryIso2 = countryCode[i].iso2
        myArray = [currentPhoneNumber,codeCountryIso2];
        return myArray; 
      }
    }
  }
  currentPhoneNumber = number
  codeCountryIso2 = cCountry
  myArray = [currentPhoneNumber,codeCountryIso2];
      return myArray;

}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: Border.br_sm,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneContainer: {
    width: "75%",
    height: 50,
  },
  button: {
    marginTop: 30,
    width: "75%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  textInput: {
    paddingVertical: 0,
  },
});

export default CodeCountry;
