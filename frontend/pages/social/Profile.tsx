import { Profile as LensProfile } from '@lens-protocol/react-native-lens-ui-kit'

import {
  ScrollView,
} from "native-base";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from 'react-native';
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";

export default function Profile({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  const profile = route.params?.profile;
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      // do something
    }

    runAsync();
  }, [])
  return (
    <LensProfile
      profile={profile}
    //headerStyles={headerStyles}
    //publicationStyles={publicationStyles}
    />
  );
}

