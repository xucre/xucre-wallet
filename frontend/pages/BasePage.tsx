import {
  ScrollView,
} from "native-base";
import React from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../service/state";

export default function BasePage({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  //{translations[language].BasePage.title}

  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>

    </ScrollView>
  );
}