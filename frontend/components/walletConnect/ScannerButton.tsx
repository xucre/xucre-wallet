import {
  AlertDialog,
  Button,
  Center,
  IconButton,
  ScrollView,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
import QRCode from "react-qr-code";
import { navigate } from '../../service/RootNavigation';

export default function ScannerButton({ navigation }: { navigation: { navigate: Function } }) {
  //{translations[language].BasePage.title}
  return <></>
  return (
    <>
      <IconButton onPress={() => { navigation.navigate('QRReader') }} colorScheme={'tertiary'} key={'scannerButton'} variant={'ghost'} _icon={{
        as: MaterialIcons,
        name: "crop-free"
      }} />
    </>
  );
}
