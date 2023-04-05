import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  ColorMode,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Icon as IconElement,
  Image,
  Input,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { RefreshControl } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

type IconType = {
  readonly name: string;
  readonly text: string;
  readonly highlight: boolean;
  readonly disabled?: boolean;
};

export default function MobileFooter({wallet: Wallet, navigation}) {
  const footerIcons: readonly IconType[] = [
    { highlight: false, name: 'home', text: 'Home' },
    { disabled: true, highlight: false, name: 'history', text: 'History' },
    { highlight: true, name: 'swap-vertical-circle', text: 'SWAP' },
    { highlight: false, name: 'live-help', text: 'Support' },
    { disabled: true, highlight: false, name: 'person', text: 'Profile' },
  ];

  const openPage = (pageName: string) => {
    switch (pageName) {
      case 'Home': 
        navigation.navigate('Home');
        break;
      case 'SWAP': 
        navigation.navigate('SwapToken');
        break;
      //case 'History': 
        //navigation.navigate('History');
        break;
      //case 'Profile': 
        //navigation.navigate('Profile');
        break;
      case 'Support':
        navigation.navigate('SupportPage');
        break;
    }
  }
  return (
    <Hidden from="md">
      <HStack
        justifyContent="space-between"
        safeAreaBottom
        h="20"
        overflow={'visible'}
        width="96%"
        position="absolute"
        left="0"
        right="0"
        bottom="2"
        alignSelf="center"
        borderTopLeftRadius="20"
        borderTopRightRadius="20"
        borderBottomRightRadius="20"
        borderBottomLeftRadius="20"
        marginLeft="1.5"
        paddingTop="0"
        _light={{ backgroundColor: 'gray.50' }}
        _dark={{ backgroundColor: 'gray.800' }}
      >
        {footerIcons.map((item, index) => {
          return (
            item.highlight ? 
            <Button
              key={index}
              variant="ghost"
              colorScheme="primary"
              _stack={{
                flexDirection: 'column',
              }}
              marginBottom={5}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size="10"
                  color={item.disabled ? "primary.800" : "primary.500"}
                  marginTop='-3'
                  marginBottom={3}
                />
              }
              _text={{
                color : item.disabled ? "primary.800" : "primary.500"
              }}
              paddingY={2}
              onPress={() => {openPage(item.text)}}
            >
              {item.text}
            </Button> :
            <Button
              key={index}
              variant="ghost"
              colorScheme="coolGray"
              _stack={{
                flexDirection: 'column',
              }}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size="5"
                  color={item.disabled ? "coolGray.400" : "coolGray.100"}
                />
              }
              _text={{
                color: item.disabled ? "coolGray.400" : "coolGray.100"
              }} 
              paddingY={0}           
              onPress={() => {openPage(item.text)}}
            >
              {item.text}
            </Button> 
          );
        })}
      </HStack>
    </Hidden>
  );
}