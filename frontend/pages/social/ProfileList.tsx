import { Profiles } from '@lens-protocol/react-native-lens-ui-kit'

import {
  ScrollView,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from 'react-native';
import { useRecoilState } from "recoil";

import { activeWallet, language as stateLanguage } from "../../service/state";


export default function ProfileList({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);

  return (
    <Profiles
      onProfilePress={
        profile => navigation.navigate(
          "ViewProfile", { profile }
        )
      }
      signedInUserAddress={_wallet.address}
    //headerStyles={headerStyles}
    //publicationStyles={publicationStyles}
    />
  );
}

