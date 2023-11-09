//import LIFI, {ChainId} from '@lifi/sdk';
import {
    Box,
    Input,
    KeyboardAvoidingView,
    Text,
    TextArea,
    useColorMode,
    VStack,
} from "native-base";
import { Button } from "native-base";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import { language as stateLanguage } from "../../frontend/service/state";
import translations from "../assets/translations";
import sendEmail from "../service/sendEmail";

export default function SuportPage({ navigation, route }: {navigation: {navigate: Function}, route: any}) {
    const [language] = useRecoilState(stateLanguage);
    const { colorMode } = useColorMode();
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [toEmail, setToEmail] = useState("");

    const handleNameChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
        setName(event.nativeEvent.text);
    };

    const viewWallet = () => {
        navigation.navigate("ViewWallet");
    };

    const handleIssueChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
        setIssue(event.nativeEvent.text);
    };

    const handletoEmailChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
        setToEmail(event.nativeEvent.text);
    };

    const send = () => {
        sendEmail(
            toEmail,
            name,
            issue,
            navigation,
            translations[language as keyof typeof translations].SupportPage.toast_send
        );
    };

    return (
        <KeyboardAvoidingView
            h={{
                base: "400px",
                lg: "auto",
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Box alignItems="center" my={10} w={"full"}>
                <Text style={styles.support1}>
                    {translations[language as keyof typeof translations].SupportPage.title}
                </Text>

                <Text style={styles.contactUsViaTypo} w='85%'>
                    <Text style={styles.ifYouHave}>
                        {translations[language as keyof typeof translations].SupportPage.introduction}
                    </Text>
                </Text>
                <VStack m={2}>
                    <Text> {translations[language as keyof typeof translations].SupportPage.to_send} </Text>
                    <Input
                        style={styles.textoImput}
                        value={toEmail}
                        onChange={handletoEmailChange}
                        w='90%'
                        mb={2}
                        placeholder={translations[language as keyof typeof translations].SupportPage.to_send}
                    />
                </VStack>

                <VStack m={3}>
                    <Text>{translations[language as keyof typeof translations].SupportPage.subject_send}</Text>

                    <Input
                        style={styles.textoImput}
                        value={name}
                        onChange={handleNameChange}
                        w='90%'
                        mb={2}
                        placeholder={translations[language as keyof typeof translations].SupportPage.subject_send}
                    />
                </VStack>

                <VStack m={3}>
                    <Text>{translations[language as keyof typeof translations].SupportPage.describe_issue}</Text>

                    <TextArea
                        autoCompleteType={"off"}
                        style={styles.textoImputArea}
                        value={issue}
                        onChange={handleIssueChange}
                        placeholder={translations[language as keyof typeof translations].SupportPage.describe_issue}
                        w='90%'
                        minHeight={200}
                    />
                </VStack>

                <Button
                    style={styles.buttonContainer}
                    mt={4}
                    width={"3/4"}
                    colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
                    onPress={send}
                >
                    <Text color={colorMode === "dark" ? Color.black : Color.white}>
                        {translations[language as keyof typeof translations].SupportPage.button_send}
                    </Text>
                </Button>

                <Button
                    style={styles.buttonContainer}
                    mt={4}
                    width={"3/4"}
                    colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
                    onPress={viewWallet}
                >
                    <Text color={colorMode === "dark" ? Color.black : Color.white}>
                        {translations[language as keyof typeof translations].SupportPage.button_cancel}
                    </Text>
                </Button>
            </Box>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: Border.br_sm,
        fontWeight: "bold",
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
    textoImput: {},
    textoImputArea: {
        borderRadius: Border.br_xs,
    },
});
