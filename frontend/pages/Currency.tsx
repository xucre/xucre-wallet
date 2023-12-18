import {
  ScrollView,
} from "native-base";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../service/state";

export default function Currency({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      // do something
    }

    runAsync();
  }, [])
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>

    </ScrollView>
  );
}