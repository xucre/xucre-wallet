import {
  Box,
  Button,
  Center,
  Text,
  useColorMode,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { storeLanguage } from "../store/language";
import { hasSignedPrivacyPolicy } from "../store/setting";
import ContainedButton from "../components/ui/ContainedButton";
import { useMixpanel } from "../hooks/useMixpanel";

export default function LanguagePage({ navigation }: { navigation: { navigate: Function } }) {
  const [languageVal, setLanguageVal] = useState('');
  const [hasSigned, setHasSigned] = useState(false);
  const mixpanel = useMixpanel();
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _hasSigned = await hasSignedPrivacyPolicy();
      if (isMounted) setHasSigned(_hasSigned);
    }
    runAsync();

    return () => {
      isMounted = false;
    }
  }, []);

  const {
    colorMode
  } = useColorMode();

  const [languageState, setLanguageState] = useRecoilState(stateLanguage);

  const updateLanguage = async (_language: string) => {
    await storeLanguage(_language);

    await mixpanel.track("view_page", { "page": "Language Page" });
    if (hasSigned) {
      navigation.navigate('SelectWallet');
    } else {
      navigation.navigate('PrivacyPolicy');
    }

  }

  const setLanguage = (val: React.SetStateAction<string>) => {
    setLanguageState(val);
    setLanguageVal(val);
    updateLanguage(val as string);
  }

  return (
    <Center h={'full'}>
      <Text color={colorMode === 'dark' ? Color.white : Color.black} fontSize={'lg'} my={10}>{translations[languageState as keyof typeof translations].LanguagePage.title_language}</Text>

      <Box alignItems="center" marginBottom={20} w={'full'}>
        <ContainedButton width={'1/2'} onPress={() => { setLanguage('es') }} style={{ margin: 10 }} buttonText={translations['es'].LanguagePage.select_language} />
        <ContainedButton width={'1/2'} onPress={() => { setLanguage('pt') }} style={{ margin: 10 }} buttonText={translations['pt'].LanguagePage.select_language} />
        <ContainedButton width={'1/2'} onPress={() => { setLanguage('qu') }} style={{ margin: 10 }} buttonText={translations['qu'].LanguagePage.select_language} />
        <ContainedButton width={'1/2'} onPress={() => { setLanguage('nah') }} style={{ margin: 10 }} buttonText={translations['nah'].LanguagePage.select_language} />
        <ContainedButton width={'1/2'} onPress={() => { setLanguage('en') }} style={{ margin: 10 }} buttonText={translations['en'].LanguagePage.select_language} />
      </Box>

    </Center>

  );
}