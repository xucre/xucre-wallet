import {
  Button,
  IconButton,
  ScrollView, Text, Tooltip, useColorMode,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as Clipboard from 'expo-clipboard';
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";

export default function CopyButton({ address }: { address: string }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [displayTooltip, setDisplayTooltip] = useState(false);
  //{translations[language].BasePage.title}
  useEffect(() => {
    const runAsync = async () => {
      // do something
    }

    runAsync();
  }, [])

  const copyToClipboard = () => {
    Clipboard.setStringAsync(String(address));
    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };

  return (
    <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
      color: "#ffffff"
    }}>
      <IconButton onPress={copyToClipboard} colorScheme={'dark'} key={'copyButton'} variant={'ghost'} _icon={{
        as: MaterialIcons,
        name: "content-copy"
      }} />
    </Tooltip>
  );
}