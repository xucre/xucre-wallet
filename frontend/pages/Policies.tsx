/* eslint-disable import/order */

import {
    Box,
    Button,
    Checkbox,
    HStack,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    useColorMode,
    VStack
} from "native-base";
import React, { useEffect, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";

import { Color, FontFamily, FontSize } from "../../GlobalStyles";
import { language as stateLanguage } from "../service/state";
import translations from "../assets/translations";
import { storePrivacyPolicy } from "../store/setting";


export default function Policies({ navigation, route }: {navigation: {navigate: Function}, route: any}) {
    const [language] = useRecoilState(stateLanguage);
    const { colorMode } = useColorMode();
    const [checkValues, setcheckValues] = useState(false);
    
    const [accept, setAccept] = useState(true)

    useEffect(() =>{
        setAccept(!checkValues)
    }, [checkValues])

    const change = () => {
        setcheckValues(!checkValues)
    }

    const acceptPolicy = async () => {
        await storePrivacyPolicy();
        navigation.navigate('NetworkDefault')
    };

    const declinePolicy = () => {
        BackHandler.exitApp();
    }

    return (
        <KeyboardAvoidingView
            h={{
                base: "300px",
                lg: "auto",
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Box alignItems="center" my={10} w={"full"}>
                <Text style={styles.support1}>
                {translations[language as keyof typeof translations].termsConditions.title}
                </Text>
                <VStack m={5}>
                    <ScrollView w={["300", "800"]}>
                        <Text>{translations[language as keyof typeof translations].termsConditions.terms}</Text>
                    </ScrollView>

                </VStack>

                <Box>
                    <HStack space={6} my={4}>
                        <Checkbox onChange={change} defaultIsChecked={checkValues} value={"true"} ><Text>{translations[language as keyof typeof translations].termsConditions.accept_terms}</Text></Checkbox>
                    </HStack>
                </Box>

                <Button
                    style={styles.buttonContainer}
                    mt={4}
                    width={"3/4"}
                    isDisabled={accept}
                    colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
                    onPress={acceptPolicy}
                >
                    <Text color={colorMode === "dark" ? Color.black : Color.white}>
                    {translations[language as keyof typeof translations].termsConditions.button_Accept}
                    </Text>
                </Button>

                <Button
                    style={styles.buttonContainer}
                    mt={4}
                    width={"3/4"}
                    colorScheme={colorMode === "dark" ? "primary" : "tertiary"}
                   onPress={declinePolicy}
                >
                    <Text color={colorMode === "dark" ? Color.black : Color.white}>
                        {translations[language as keyof typeof translations].SupportPage.button_cancel}
                    </Text>
                </Button>
            </Box>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 100,
        fontWeight: "bold",
    },
    support1: {
        fontFamily: FontFamily.inter,
        fontSize: FontSize.size_2xl,
        fontWeight: "600",
        letterSpacing: -0.2,
        lineHeight: 30,
    },
});