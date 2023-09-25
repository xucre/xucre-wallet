/* eslint-disable import/order */

import {
    Box,
    Button,
    Center,
    Checkbox,
    HStack,
    Input,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextArea,
    useColorMode,
    View,
    VStack
} from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import React, { useEffect, useMemo, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import { language as stateLanguage } from "../service/state";
import translations from "../assets/translations";
import { storePrivacyPolicy } from "../store/setting";
import { navigate } from '../service/RootNavigation';


export default function Policies({ navigation, route }) {
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
        navigation.navigate('SelectWallet')
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
                {translations[language].termsConditions.title}
                </Text>
                <VStack m={5}>
                    <ScrollView w={["300", "800"]}>
                        <Text>{translations[language].termsConditions.terms}</Text>
                    </ScrollView>

                </VStack>

                <Box>
                    <HStack space={6} my={4}>
                        <Checkbox onChange={change} defaultIsChecked={checkValues} value={"true"} ><Text>{translations[language].termsConditions.accept_terms}</Text></Checkbox>
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
                    {translations[language].termsConditions.button_Accept}
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
                        {translations[language].SupportPage.button_cancel}
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