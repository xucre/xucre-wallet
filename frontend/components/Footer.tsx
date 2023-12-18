import { MaterialIcons } from "@expo/vector-icons";
import {
  Button,
  Hidden,
  HStack,
  Icon,
  useColorMode,
} from "native-base";
import React, { } from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { Platform } from "react-native";


type IconType = {
  readonly name: string;
  readonly text: string;
  readonly highlight: boolean;
  readonly disabled?: boolean;
};



export default function MobileFooter({ navigation }: { navigation: { navigate: Function } }) {

  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const homeButton = translations[language as keyof typeof translations].Buttons_Footer.home;
  const historyButton = translations[language as keyof typeof translations].Buttons_Footer.history;
  const buttonNft = translations[language as keyof typeof translations].Buttons_Header.nft;
  const swapButton = translations[language as keyof typeof translations].Buttons_Footer.buttonswap;
  const supportButton = translations[language as keyof typeof translations].Buttons_Footer.support;
  const profileButton = translations[language as keyof typeof translations].Buttons_Footer.profile;
  const feedButton = translations[language as keyof typeof translations].Buttons_Footer?.feed || 'Feed';


  const footerIcons: readonly IconType[] = [
    { highlight: false, name: 'home', text: homeButton },
    { disabled: false, highlight: false, name: 'image-search', text: buttonNft },
    { highlight: true, name: 'swap-vertical-circle', text: swapButton },
    { highlight: false, name: 'live-help', text: supportButton },
    { disabled: false, highlight: false, name: 'dynamic-feed', text: feedButton },
  ];

  const openPage = (pageName: string) => {
    switch (pageName) {
      case 'Home':
        navigation.navigate('ViewWallet');
        break;
      case 'SWAP':
        navigation.navigate('SwapToken');
        break;
      case 'History':
        navigation.navigate('WalletHistory');
        break;
      case 'Feed':
        navigation.navigate('ProfileList');
        break;
      case 'Support':
        navigation.navigate('SupportPage');
        break;
      case 'NFT':
        navigation.navigate('NFT');
        break;
    }
  }
  return (
    <Hidden from="md">
      <HStack
        justifyContent={'space-evenly'}
        alignItems={'flex-start'}
        safeAreaBottom
        h="9%"
        overflow={'visible'}
        width="96%"
        position={'absolute'}
        left="0"
        right="0"
        bottom="10"
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
          const colorScheme = item.highlight ? colorMode === 'dark' ? 'primary' : 'tertiary' : colorMode === 'dark' ? 'coolGray' : 'coolGray';
          return (
            <Button
              key={index}
              variant="ghost"
              colorScheme={colorScheme}
              width={'1/5'}
              height={'auto'}
              _stack={{
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'center'
              }}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size={item.highlight ? 10 : 7}
                  _dark={{
                    color: item.highlight ? item.disabled ? "primary.400" : "primary.600" : item.disabled ? "coolGray.400" : "coolGray.100"
                  }}
                  _light={{
                    color: item.highlight ? item.disabled ? "primary.600" : "primary.400" : item.disabled ? "coolGray.300" : "coolGray.500"
                  }}
                  marginTop={item.highlight ? -5 : -1}
                  marginBottom={item.highlight ? 2 : 1}
                />
              }
              _text={item.highlight ? {
                color: item.disabled ?
                  colorMode === 'dark' ? "primary.200" : "primary.400" :
                  colorMode === 'dark' ? "primary.200" : "primary.400",
                width: 12,
                height: 10,
                fontSize: 12,
                textAlign: 'center'
              } : {
                color: item.disabled ?
                  colorMode === 'dark' ? "coolGray.400" : "coolGray.400" :
                  colorMode === 'dark' ? "coolGray.100" : "coolGray.600",
                width: 'full',
                height: 10,
                fontSize: 12,
                textAlign: 'center',
              }}
              _pressed={{
                bg: `transparent`,
                _icon: {
                  _dark: {
                    color: `${colorScheme}.600:alpha.50 !important`
                  }
                },
                _text: {
                  color: `${colorScheme}.600:alpha.50`
                }

              }}
              paddingY={item.highlight ? 2 : 0}
              onPress={() => { openPage(item.text) }}
            >
              {item.text}
            </Button>
          );
        })}
      </HStack>
    </Hidden >
  );
}