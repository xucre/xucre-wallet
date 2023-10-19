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
import { Button, useColorMode, Text, Divider, Select} from "native-base";
import codeCountry from "../../assets/json/codeCountry.json";
import PhoneInput from 'react-phone-number-input/react-native-input';
import {Country, isValidPhoneNumber, parsePhoneNumber, PhoneNumber} from 'react-phone-number-input';
import { count } from "console";
import {phone} from 'phone';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { CountrySelectComponent } from 'react-phone-number-input'
import { ToastAndroid } from 'react-native';



const CodeCountry = ({ navigation, route }) => {
  

  const [language] = useRecoilState(stateLanguage);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const [countryCode, setCountryCode] = useState('US' as Country);
  const { colorMode } = useColorMode();
  let _final: any;
  const phoneInput = useRef(null);
  useEffect(() => {
      setPhoneNumber(route.params.param1.phoneNumbers[0].number);  
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

      const regex = /^\+/;
      const isValidNumber = regex.test(phoneNumber);

      isValidNumber ? (_final = phoneNumber, buttonPressSend()) :  ToastAndroid.show(translations[language].WhatsAppNotification.notificationNumber,ToastAndroid.TOP)
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
        { param1: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=xucre.expo.client", param2: route.params.param2 },
        translations[language].QRWallet.toast_send
      );
      await delay(3000);
      navigation.navigate("QRWallet");
    };
    const formaterNumber = () => {
      const regex = /^\+/;
      const isValidNumber = regex.test(phoneNumber);
      isValidNumber ? (_final = phoneNumber, buttonPress()) :  ToastAndroid.show(translations[language].WhatsAppNotification.notificationNumber,ToastAndroid.TOP)
    };
    return componentsView(formaterNumber);
  }

  function componentsView(formaterNumber) {
    return (
      <View style={styles.container}>
        
        <PhoneInput
          international
          withCountryCallingCode
          value={route.params.param1.phoneNumbers[0].number}
          onChange={setPhoneNumber}          
          labels={{"phone": "Phone"}}
          style={{
            borderBottomWidth: 1,
            borderColor: '#ccc',
            minWidth: '33%',
            textAlign: 'center',
            color: colorMode === "dark" ? Color.white : Color.black
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
