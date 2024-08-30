import {
  Button,
  IconButton,
  Menu,
  ScrollView, Text, Tooltip, useColorMode,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as Clipboard from 'expo-clipboard';
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";
import { Chain } from "../../types/token";

export default function CopyButton({ address, btcAddress }: { address: string, btcAddress: string }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [displayTooltip, setDisplayTooltip] = useState(false);
  //{translations[language].BasePage.title}


  const copyToClipboard = (chain: Chain) => {
    if (chain === Chain.BITCOIN) {
      Clipboard.setStringAsync(String(btcAddress));
    } else {
      Clipboard.setStringAsync(String(address));
    }

    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };

  return (
    <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
      color: "#ffffff"
    }}>
      <Menu w="190" trigger={triggerProps => {
        return <IconButton {...triggerProps} colorScheme={'dark'} key={'copyButton'} variant={'ghost'} _icon={{
          as: MaterialIcons,
          name: "content-copy"
        }} />
      }}>
        <Menu.Item onPress={() => copyToClipboard(Chain.ETHEREUM)}>{Chain.ETHEREUM}</Menu.Item>
        <Menu.Item onPress={() => copyToClipboard(Chain.BITCOIN)}>{Chain.BITCOIN}</Menu.Item>
      </Menu>
    </Tooltip>
  );
}