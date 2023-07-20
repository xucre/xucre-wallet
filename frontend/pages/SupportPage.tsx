
//import LIFI, {ChainId} from '@lifi/sdk';
import sendgrid from '@sendgrid/mail';
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { Box, Center, Input, KeyboardAvoidingView, Text, TextArea, useColorMode, View, VStack } from 'native-base';
import { Button } from 'native-base'
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import { language as stateLanguage} from '../../frontend/service/state';
import translations from '../assets/translations';
import sendEmail from '../service/sendEmail'



export default function SuportPage({ navigation, route }) {

    const [language, ] = useRecoilState(stateLanguage);
    const {colorMode} = useColorMode();
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

    const send = () => {
        sendEmail(toEmail,name,issue, navigation, translations[language].SupportPage.toast_send);
    }


    return (

        <KeyboardAvoidingView h={{
            base: "400px",
            lg: "auto"
        }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Box alignItems="center" my={10} w ={'full'} >
                <Text style={styles.support1}>{translations[language].SupportPage.title}</Text>

                <Text style={styles.contactUsViaTypo}>
                    <Text
                        style={styles.ifYouHave}>{translations[language].SupportPage.introduction}</Text>
                </Text>
                <VStack m={3}>
                    <Text > {translations[language].SupportPage.to_send} </Text>
                    <Input style={styles.textoImput} value={toEmail} onChange={handletoEmailChange} w={'3/4'} mb={2} placeholder={translations[language].SupportPage.to_send} />
                </VStack>

                
                <VStack m={3}>
                    <Text >{translations[language].SupportPage.subject_send}</Text>
                
                    <Input style={styles.textoImput} value={name} onChange={handleNameChange} w={'3/4'} mb={2} placeholder={translations[language].SupportPage.subject_send} />
                    
                </VStack>

                <VStack m={3}>
                    <Text >{translations[language].SupportPage.describe_issue}</Text>
                    
                    {/*  <Input style={styles.textoImputArea} value={issue} onChange={handleIssueChange} placeholderTextColor={'white'} w="105%" mb={2}  placeholder="Suggestions and / or report problems" /> */}
                    <TextArea autoCompleteType={"off"} style={styles.textoImputArea} value={issue} onChange={handleIssueChange} placeholder={translations[language].SupportPage.describe_issue} w={'3/4'}  minHeight={200}/>
                    
                </VStack>

                <Button style={styles.buttonContainer} mt={4} width={'3/4'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={send}><Text color={colorMode === 'dark' ? Color.black : Color.white}>{translations[language].SupportPage.button_send}</Text></Button>
            
            </Box>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: Border.br_sm,
        fontWeight: 'bold',
    },
    contactUsViaTypo: {
        fontFamily: FontFamily.inter,
        fontSize: FontSize.size_base,
        letterSpacing: -0.2,
        lineHeight: 21,
    },
    ifYouHave: {
        color: Color.darkgray_100,
    },
    support1: {
        fontFamily: FontFamily.inter,
        fontSize: FontSize.size_2xl,
        fontWeight: "600",
        letterSpacing: -0.2,
        lineHeight: 30,
    },
    textoImput: {
    },
    textoImputArea: {
        borderRadius: Border.br_xs,
    },
});