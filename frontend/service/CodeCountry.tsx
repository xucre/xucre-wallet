/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable functional/no-let */
/* eslint-disable sort-keys */
/* eslint-disable react-native/no-color-literals */

import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input'
import whatsapp from './whatsapp';
import { language as stateLanguage} from '../../frontend/service/state';
import translations from '../assets/translations';
import { useRecoilState } from 'recoil';
import QRWallet from '../pages/wallet/QRWallet';

const CodeCountry = ({ navigation, route }) => {
    const [language, ] = useRecoilState(stateLanguage);
    const [phoneNumber, setphoneNumber] = useState('');
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    let _final;
    const phoneInput = useRef(null);

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    const buttonPress = async () => {
        whatsapp(_final, 'shareqrcode', 'en_US', { param1: 'www.google.com', param2: route.params.param2 }, translations[language].QRWallet.toast_send);
        await delay(3000);
        navigation.navigate('QRWallet')
    };
    return (
        <View style={styles.container}>
            <PhoneInput
                ref={phoneInput}
                defaultValue={route.params.param1.phoneNumbers[0].number}
                defaultCode="EC"
                layout="first"
                withShadow
                //autoFocus
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.textInput}
                onChangeFormattedText={(text) => {
                    setphoneNumber(text);
                }}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    const checkValid = phoneInput.current?.isValidNumber(value);
                    setValid(checkValid ? checkValid : false);
                    let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
                    console.log('fORMATTER :', getNumberAfterPossiblyEliminatingZero.formattedNumber);
                    _final = getNumberAfterPossiblyEliminatingZero.formattedNumber

                    setphoneNumber(getNumberAfterPossiblyEliminatingZero.formattedNumber);
                    buttonPress();
                }}
            >
                <Text>Send Whatsapp</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneContainer: {
        width: '75%',
        height: 50,
    },
    button: {
        marginTop: 30,
        width: '75%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
    },
    textInput: {
        paddingVertical: 0,
    },
});

export default CodeCountry;