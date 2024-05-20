/* eslint-disable sort-keys */
/* eslint-disable import/order */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Color } from "../../../GlobalStyles";

import {
  Avatar,
  Box,
  Button,
  FlatList,
  HStack,
  Icon,
  Menu,
  Pressable,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
import { useRecoilState } from "recoil";
import { getIconImage } from "../../service/api";
import translations from "../../assets/translations";
import GuestLayout from '../../layouts/GuestLayout';
import {
  activeNetwork,
  networkList,
  selectedNetwork,
  language as stateLanguage,
} from "../../service/state";
import { deleteNetwork, getNetworks, storeActiveNetwork } from "../../store/network";
import { Network } from "../../service/network";
import { extensionList } from '../../service/constants';
import { RefreshControl } from "react-native";
import ExtensionItem from "../../components/extensions/ExtensionItem";
import MobileFooter from "../../components/Footer";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExtensionItemSmall from "../../components/extensions/ExtensionItemSmall";
import ExtensionItemLarge from "../../components/extensions/ExtensionItemLarge";

export default function SelectExtension({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const extensions = extensionList(language);

  return (
    <DashboardLayout title={''} >
      <Box
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        width={'full'}
        px={2}
        safeAreaBottom
      >
        <Box height={220} >
          <Text variant="h6" color={colorMode === 'dark' ? 'white' : 'black'} fontWeight="bold" fontSize="md">{translations[language as keyof typeof translations].ui.featured}</Text>
          <ExtensionItemLarge key={`${extensions[0].title}0`} navigation={navigation} metadata={extensions[0]} />
        </Box>
        <Text variant="h6" color={colorMode === 'dark' ? 'white' : 'black'} fontWeight="bold" py={5} fontSize="md">{`${translations[language as keyof typeof translations].ui.all} dApps`} </Text>
        <FlatList data={extensions} renderItem={
          ({ item, index }) => index === 0 ? <></> : <ExtensionItemSmall key={item.title + index} navigation={navigation} metadata={item} />
        } />
      </Box>
      <MobileFooter navigation={navigation}></MobileFooter>
    </DashboardLayout>
  )
}
