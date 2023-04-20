//import LIFI, {ChainId} from '@lifi/sdk';
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { Box, Input, Text, TextArea, View } from 'native-base';
import { Button } from 'native-base'
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';

import { language as stateLanguage} from '../../frontend/service/state';
import sendEmail from '../service/sendEmail'
import { twillioEmail } from '../service/twillioEmail';
import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import sendgrid from '@sendgrid/mail';

import translations from '../assets/translations';






export default function SuportPage({ navigation, route }) {

    const [language, ] = useRecoilState(stateLanguage);

    const [name, setName] = useState('');
    const [issue, setIssue] = useState('');
    const [toEmail, setToEmail] = useState('');

    const handleNameChange = (event) => {
        //console.log(event.nativeEvent.text);
        setName(event.nativeEvent.text)
    }

    const handleIssueChange = (event) => {
        //console.log(event.nativeEvent.text);
        setIssue(event.nativeEvent.text)
    }

    const handletoEmailChange = (event) => {
        //console.log(event.nativeEvent.text);
        setToEmail(event.nativeEvent.text)
    }


    return (

        <Box alignItems="center" marginBottom={20} h={'full'} w ={'full'}>


            <Text style={styles.support1}>{translations[language].SupportPage.title}</Text>

            <Text style={[styles.ifYouHaveContainer, styles.contactUsViaTypo]}>
                <Text
                    style={styles.ifYouHave}>{translations[language].SupportPage.introduction}</Text>
            </Text>
            <View style={[styles.input, styles.inputPosition]}>
                <Text style={styles.email}> {translations[language].SupportPage.to_send} </Text>
                <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                    <Input style={styles.textoImput} value={toEmail} onChange={handletoEmailChange} placeholderTextColor={'white'} w="105%" mb={2} placeholder={translations[language].SupportPage.to_send} />
                </View>
            </View>

            <View style={[styles.input, styles.inputPosition1]}>
                <Text style={styles.email}>{translations[language].SupportPage.subject_send}</Text>
                <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                    <Input style={styles.textoImput} value={name} onChange={handleNameChange} placeholderTextColor={'white'} w="105%" mb={2} placeholder={translations[language].SupportPage.subject_send} />
                </View>
            </View>

            <View style={[styles.input1, styles.inputPosition2]}>
                <Text style={styles.email}>{translations[language].SupportPage.describe_issue}</Text>
                <View style={[styles.rectangleGroup, styles.groupLayout]}>
                    {/*  <Input style={styles.textoImputArea} value={issue} onChange={handleIssueChange} placeholderTextColor={'white'} w="105%" mb={2}  placeholder="Suggestions and / or report problems" /> */}
                    <TextArea h={20} style={styles.textoImputArea} value={issue} onChange={handleIssueChange} placeholder={translations[language].SupportPage.describe_issue} placeholderTextColor={'white'} w="105%" h="200" maxW="400" />
                </View>
            </View>

            <Button style={styles.buttonContainer} onPress={() => sendEmail(toEmail,name,issue, navigation, translations[language].SupportPage.toast_send)}><Text color={'#000'}>{translations[language].SupportPage.button_send}</Text></Button>

        </Box>
    )
}


const styles = StyleSheet.create({
    rectangleParent1: {
        top: 330,
        borderRadius: Border.br_sm,
        backgroundColor: '#D4E815',
        fontFamily: FontFamily.interSemibold,
    },
    rectangleLayout: {
        height: 60,
        width: 330,
        position: "absolute",
        borderColor: '#fff',
    },
    support: {
        backgroundColor: Color.black,
        borderColor: "#000",
        flex: 1,
        width: "100%",
        height: 844,
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid",
        textAlign: "center",
        position: 'absolute'
    },
    support1: {
        top: 39,
        fontSize: FontSize.size_2xl,
        lineHeight: 30,
        textAlign: "left",
        fontFamily: FontFamily.interSemibold,
        fontWeight: "600",
        letterSpacing: -0.2,
        color: Color.white,
        position: "absolute",
    },
    ifYouHaveContainer: {
        top: 121,
    },
    contactUsViaTypo: {
        width: 330,
        fontFamily: FontFamily.interRegular,
        lineHeight: 21,
        fontSize: FontSize.size_base,
        textAlign: "left",
        letterSpacing: -0.2,
        position: "absolute",
    },
    ifYouHave: {
        color: Color.darkgray_100,
    },
    supportxsucrecom: {
        color: Color.white,
    },
    input: {
        top: 192,
        height: 74,
    },
    inputPosition: {
        width: 351,
        position: "absolute",
    },
    inputPosition1: {
        width: 351,
        top: 285,
        position: "absolute",
    },

    inputPosition2: {
        width: 351,
        top: 380,
        position: "absolute",
    },

    rectangleParent: {
        top: 27,
    },
    groupItemLayout: {
        height: 47,
        width: 351,
        position: "absolute",
    },
    groupBorder: {
        borderColor: "#7b7b7b",
        backgroundColor: Color.gray_300,
        borderRadius: Border.br_xs,
        top: 0,
        borderWidth: 1,
        borderStyle: "solid",
    },
    groupItemLayout: {
        height: 47,
        width: 351,
        position: "absolute",
    },
    youremailcom: {
        top: 12,
        width: 311,
        color: Color.dimgray,
        position: "absolute",
    },
    youremailcomTypo: {
        width: 311,
        color: Color.dimgray,
        fontFamily: FontFamily.interRegular,
        lineHeight: 21,
        fontSize: FontSize.size_base,
        textAlign: "left",
        letterSpacing: -0.2,
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
    textoImputArea: {
        borderRadius: Border.br_xs,
        backgroundColor: Color.gray_300,
        borderColor: "#7b7b7b",
        borderWidth: 1,
        borderStyle: "solid",
        width: 339,
        top: 0,
        height: 200,
        verticalAlign: 'top',
        position: "relative",
        borderBottomWidth: 1,
        multiline: true,
        textAlign: "left"


    },

    input1: {
        top: 284,
        height: 217,
    },
    rectangleGroup: {
        top: 27,
    },
    groupLayout: {
        height: 190,
        width: 351,
        left: 0,
        position: "absolute",
    },
    groupBorder: {
        borderColor: "#7b7b7b",
        backgroundColor: Color.gray_300,
        borderRadius: Border.br_xs,
        top: 0,
        borderWidth: 1,
        borderStyle: "solid",
    },
    buttonContainer: {
        fontWeight: 'bold',
        // eslint-disable-next-line sort-keys
        backgroundColor: '#D4E815',
        position: 'relative',
        width: 370,
        top: 650,
        textAlign: "left",
        borderRadius: Border.br_sm,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: '#fff',

    },
});