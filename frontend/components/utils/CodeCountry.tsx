/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable sort-imports */
/* eslint-disable import/order */
/* eslint-disable functional/no-let */
/* eslint-disable sort-keys */
/* eslint-disable react-native/no-color-literals */

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import whatsapp from "../../service/whatsapp";
import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
import { useRecoilState } from "recoil";
import { Color } from "../../../GlobalStyles";
import { Button, useColorMode, Text} from "native-base";
import PhoneInput from 'react-phone-number-input/react-native-input';
import {Country} from 'react-phone-number-input';
// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native';
import { RouteProp, ParamListBase, RouteConfigComponent } from "@react-navigation/native";



const CodeCountry = ({ navigation, route }: {navigation: {navigate: Function}, route: any}) => {
  

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

  const verilanguage = VerificationLengaje(language);

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

      isValidNumber ? (_final = phoneNumber, buttonPressSend()) :  ToastAndroid.show(translations[language as keyof typeof translations].WhatsAppNotification.notificationNumber,ToastAndroid.TOP)
    };
    const buttonPressSend = async () => {
      const amoutAndName = route.params.param3 + " " + route.params.param5;
      whatsapp(
        _final,
        "shared_notification",
        //"en_US",
        verilanguage,
        { param1: route.params.param2, param2: amoutAndName },
        translations[language as keyof typeof translations].QRWallet.toast_send
      );
      await delay(3000);
      navigation.navigate("ViewWallet");
    };

    return componentsView(formaterNumberSend);

  } else {
    const buttonPress = async () => {
      
      whatsapp(
        _final,
        "share_address",
        //"es",
        verilanguage,
        { param1: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=xucre.expo.client", param2: route.params.param2 },
        translations[language as keyof typeof translations].QRWallet.toast_send
      );
      await delay(3000);
      navigation.navigate("QRWallet");
    };
    const formaterNumber = () => {
      const regex = /^\+/;
      const isValidNumber = regex.test(phoneNumber);
      isValidNumber ? (_final = phoneNumber, buttonPress()) :  ToastAndroid.show(translations[language as keyof typeof translations].WhatsAppNotification.notificationNumber,ToastAndroid.TOP)
    };
    return componentsView(formaterNumber);
  }

  function componentsView(formaterNumber: Function) {
    return (
      <View style={styles.container}>
        
        <PhoneInput
          international
          withCountryCallingCode
          value={route.params.param1.phoneNumbers[0].number}
          onChange={(val) => {setPhoneNumber(val as string)}}          
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
              {translations[language as keyof typeof translations].WhatsAppNotification.Send_Button}
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
              {translations[language as keyof typeof translations].SupportPage.button_cancel}
            </Text>
          </Button>
        </Button.Group>
        

      </View>
    );
  }

};

function VerificationLengaje(vLengaje: string) {
  if(vLengaje === 'en' || vLengaje === 'nah' || vLengaje === 'qu'){
    return 'en_US'
  }else if(vLengaje === 'es'){
    return 'es'
  }else if(vLengaje === 'pt'){
    return 'pt_BR'
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
