import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import {
  AlertDialog,
  ArrowBackIcon,
  Badge,
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
  Select,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";

export default function SelectLanguage () {
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);


  return (
    <VStack>
        {
          // TODO: Style notification badge
        }
        <IconButton colorScheme="coolGray" key={'test1'} variant={'ghost'} _icon={{
          as: MaterialIcons,
          name: "notifications"
        }} />
      </VStack>
    
  );
}

