/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable sort-imports */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable functional/no-let */
/* eslint-disable sort-keys */
/* eslint-disable react-native/no-color-literals */

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
//import PhoneInput from "react-native-phone-number-input";
//import PhoneInput from 'react-phone-number-input/react-native-input';
import flags from 'react-phone-number-input/flags'
import whatsapp from "../../service/whatsapp";
import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
import { useRecoilState } from "recoil";
import { Border, Color } from "../../../GlobalStyles";
import { Button, useColorMode, Text, Divider } from "native-base";
import codeCountry from "../../assets/json/codeCountry.json";
import PhoneInput from 'react-phone-number-input/react-native-input';
import {Country, isValidPhoneNumber, parsePhoneNumber, PhoneNumber} from 'react-phone-number-input';
import { count } from "console";
import {phone} from 'phone';

const CodeCountry = ({ navigation, route }) => {

  const nn = veri(route.params.param1.phoneNumbers[0].number, route.params.param3.countryCode);

  const [language] = useRecoilState(stateLanguage);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const [countryCode, setCountryCode] = useState('US' as Country);
  const { colorMode } = useColorMode();
  let _final: any;
  const phoneInput = useRef(null);
  useEffect(() => {
    if (nn[0]){
      const phone_2 = phone(nn[0]);
      if (phone_2.isValid) {
        setPhoneNumber(phone_2.phoneNumber);
        setCountryCode(phone_2.countryIso2 as Country);
      }
      
    }
    
  },[])

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const navigationScreens = () => {
    if (route.params.param4 === "send") {
      navigation.navigate('SendNotificationToken');
    }else{
      navigation.navigate('QRWallet');
    }
    
  }

  if (route.params.param4 === "send") {
    const formaterNumberSend = () => {
      const checkValid = phoneInput.current?.isValidNumber(value);
      _final = numberFormat(checkValid, phoneInput)
      buttonPressSend();
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

    return componentsView(formaterNumberSend);

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
      _final = numberFormat(checkValid, phoneInput)
      buttonPress();
    };
    return componentsView(formaterNumber);
  }

  function componentsView(formaterNumber) {
    return (
      <View style={styles.container}>
        <PhoneInput
          defaultCountry={countryCode}
          value={phoneNumber}
          onChange={setPhoneNumber}
          labels={{"phone": "Phone"}}
          style={{
            borderBottomWidth: 1,
            borderColor: '#ccc',
            minWidth: '33%',
            textAlign: 'center'
          }}
        />

        <Button.Group isAttached={true}>
          <Button
            style={styles.buttonContainerLeft}
            mt={4}
            width={"2/5"}
            mr={0}
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
            style={styles.buttonContainerRight}
            mt={4}
            ml={0}
            width={"2/5"}
            colorScheme={colorMode === "dark" ? "primary" : "info"}
            onPress={navigationScreens}
          >
            <Text color={colorMode === "dark" ? Color.black : Color.white}>
              {translations[language].SupportPage.button_cancel}
            </Text>
          </Button>
        </Button.Group>
        

      </View>
    );
  }

};

function veri(number: string, cCountry: string) {
  let currentPhoneNumber = ""
  let codeCountryIso2 = ""
  let myArray = []
  if (number.includes("+")) {
    let str = number.slice(1)
    return myArray = getCountryCodenumber(str)
  } else if (!number.includes("+")) {
    myArray = getCountryCodenumber(number)
    if (myArray === undefined) {
      currentPhoneNumber = number
      codeCountryIso2 = cCountry
      myArray = [currentPhoneNumber, codeCountryIso2];
      return myArray;
    } else {
      return myArray
    }
  }
}

function getCountryCodenumber(number: string) {
  let countryCode = codeCountry
  let currentPhoneNumber = ""
  let codeCountryIso2 = ""
  let myArray = []
  for (const country of countryCode) {
    let lc = country.phone_code.length
    if (number.startsWith(country.phone_code)) {
      currentPhoneNumber = number.substring(lc).trim();
      codeCountryIso2 = country.iso2
      myArray = [currentPhoneNumber, codeCountryIso2];
      return myArray;
    }
  }
}

function numberFormat(checkValid: any, phoneInput: React.MutableRefObject<any>) {
  if (!checkValid) {
    let numberfinal: any
    let character = "+";
    let phoneNumber = phoneInput.current.state.number;
    let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    let newFormatterNumber = phoneNumber.includes(
      phoneInput.current.state.code
    )
      ? phoneNumber.replace(character + phoneInput.current.state.code, "")
      : getNumberAfterPossiblyEliminatingZero.number;
    return numberfinal = phoneInput.current.state.code + newFormatterNumber;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 100,
    fontWeight: "bold",
  },
  buttonContainerLeft: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    margin: 0
  },
  buttonContainerRight: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    margin: 0
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
  textInput: {
    paddingVertical: 0,
  },
});

export default CodeCountry;
