import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Center,
  Container,
  extendTheme,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  MoonIcon,
  NativeBaseProvider,
  Pressable,
  SunIcon,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, { useEffect, useRef, useState} from 'react';

export default function SettingsDrawer ({setScheme}) {
  const {
    colorMode
  } = useColorMode();
  
  return (
    <IconButton size={'sm'} variant="ghost" colorScheme={colorMode === 'light'? 'coolGray': 'coolGray'} _icon={{
      as: MaterialIcons,
      name: "menu"
    }} />
  );
}

export const ToggleDarkMode = ({setScheme}) => {
  const {
    colorMode,
    setColorMode
  } = useColorMode();

  useEffect(() => {
    setScheme(colorMode);
  }, [colorMode]);

  return (
    <Pressable onPress={() => colorMode === "light" ? setColorMode("dark") : setColorMode("light")}>
      {useColorModeValue(<MoonIcon size="6" />, <SunIcon size="6" />)}
    </Pressable>
  )
}