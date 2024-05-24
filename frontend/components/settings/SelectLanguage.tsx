import { MaterialIcons } from "@expo/vector-icons";
import {
  Menu,
  Pressable,
  Text,
  useColorMode,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { language as stateLanguage } from "../../service/state";
import { getLanguage, storeLanguage } from "../../store/language";

export default function SelectLanguage() {
  const [languageVal, setLanguageVal] = useState('');

  const {
    colorMode
  } = useColorMode();

  const [languageState, setLanguageState] = useRecoilState(stateLanguage);
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _language = await getLanguage();
      if (_language) {
        if (isMounted) setLanguageState(_language);
        if (isMounted) setLanguageVal(_language);
      } else {
        if (isMounted) setLanguageState('en');
        if (isMounted) setLanguageVal('en');
      }

    }
    runAsync();
    return () => { isMounted = false };
  }, []);

  const updateLanguage = async (_language: string) => {
    await storeLanguage(_language);
  }

  const setLanguage = (val: React.SetStateAction<string>) => {
    setLanguageState(val);
    setLanguageVal(val);
    updateLanguage(val as string);
  }

  return (
    <>
      {languageVal !== '' &&
        <Menu w="190" trigger={triggerProps => {
          return <Pressable accessibilityLabel="options" {...triggerProps}>
            <MaterialIcons name="language" size={24} color={'gray'} />
          </Pressable>;
        }}>
          <Menu.Item onPress={() => { setLanguage('es') }}><Text>{translations[languageVal as keyof typeof translations].SelectLanguage.es}</Text></Menu.Item>
          <Menu.Item onPress={() => { setLanguage('pt') }}><Text>{translations[languageVal as keyof typeof translations].SelectLanguage.pt}</Text></Menu.Item>
          <Menu.Item onPress={() => { setLanguage('qu') }}><Text>{translations[languageVal as keyof typeof translations].SelectLanguage.qu}</Text></Menu.Item>
          <Menu.Item onPress={() => { setLanguage('nah') }}><Text>{translations[languageVal as keyof typeof translations].SelectLanguage.nah}</Text></Menu.Item>
          <Menu.Item onPress={() => { setLanguage('en') }}><Text>{translations[languageVal as keyof typeof translations].SelectLanguage.en}</Text></Menu.Item>
        </Menu>
      }
    </>

  );
}

