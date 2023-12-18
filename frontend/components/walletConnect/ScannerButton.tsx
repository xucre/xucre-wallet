import {
  AlertDialog,
  Button,
  Center,
  IconButton,
  ScrollView,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
import QRCode from "react-qr-code";
import { navigate } from '../../service/RootNavigation';

export default function ScannerButton({ navigation }: { navigation: { navigate: Function } }) {
  const [language,] = useRecoilState(stateLanguage);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      // do something
    }

    runAsync();
  }, [])
  return (
    <>
      <IconButton onPress={() => { navigation.navigate('QRReader') }} colorScheme={'tertiary'} key={'scannerButton'} variant={'ghost'} _icon={{
        as: MaterialIcons,
        name: "crop-free"
      }} />
    </>
  );
}
