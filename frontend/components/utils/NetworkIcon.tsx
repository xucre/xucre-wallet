import { MaterialIcons } from "@expo/vector-icons";
import {
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MoonIcon,
  Pressable,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { Network } from "../../service/network";
import { activeNetwork, activeWallet, selectedNetwork, language as stateLanguage, } from "../../service/state";


export default function NetworkIcon({ navigation, close, isInline }: { navigation: { navigate: Function }, close: Function, isInline: boolean }) {
  const [language,] = useRecoilState(stateLanguage);
  const [network, setSelectedNetwork] = useRecoilState(selectedNetwork);
  const { colorMode } = useColorMode();
  const [avatar, setAvatar] = useState('');
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  //const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/'+ _activeNetwork.symbol.toLowerCase() +'.png';
  const isDark = colorMode === 'dark';
  //{translations[language].BasePage.title}
  useEffect(() => {
    if (_activeNetwork.symbol && _activeNetwork.symbol !== '') {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + _activeNetwork.symbol.toLowerCase() + '.png');
      setSelectedNetwork(_activeNetwork as Network)
    }
  }, [_activeNetwork, network])

  return (
    <>
      {avatar !== '' && !isInline &&
        <Button variant={'unstyled'} onPress={() => { navigation.navigate('SelectNetwork'); close(false); }}>
          <Avatar bg={isDark ? 'coolGray.800' : 'coolGray.300'} size="sm" source={{
            uri: avatar
          }} />
        </Button>
      }

      {avatar !== '' && isInline &&
        <Avatar size="sm" mt={-2} source={{
          uri: avatar
        }} />
      }
    </>

  );
}