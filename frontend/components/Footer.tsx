import { MaterialIcons } from "@expo/vector-icons";
import {
  Button,
  Hidden,
  HStack,
  Icon,
  useColorMode,
} from "native-base";
import React, {} from "react";
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



export default function MobileFooter({navigation}: {navigation: {navigate: Function}}) {

  const [language,] = useRecoilState(stateLanguage);
  const {colorMode} = useColorMode();
  const homeButton = translations[language as keyof typeof translations].Buttons_Footer.home;
  const historyButton = translations[language as keyof typeof translations].Buttons_Footer.history;
  const buttonNft = translations[language as keyof typeof translations].Buttons_Header.nft; 
  const swapButton = translations[language as keyof typeof translations].Buttons_Footer.buttonswap;
  const supportButton = translations[language as keyof typeof translations].Buttons_Footer.support;
  const profileButton = translations[language as keyof typeof translations].Buttons_Footer.profile;

  const footerIcons: readonly IconType[] = [
    { highlight: false, name: 'home', text: homeButton },
    { disabled: false, highlight: false, name: 'image-search', text: buttonNft }, 
    { highlight: true, name: 'swap-vertical-circle', text: swapButton },
    { highlight: false, name: 'live-help', text: supportButton },
    { disabled: true, highlight: false, name: 'person', text: profileButton },
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
      //case 'Profile': 
        //navigation.navigate('Profile');
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
        safeAreaBottom
        h="8%"
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
            <Button
              key={index}
              variant="ghost"
              colorScheme={item.highlight ? colorMode === 'dark' ? 'primary' : 'tertiary': colorMode === 'dark' ? 'coolGray' : 'coolGray'}
              _stack={{
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center'
              }}
              marginBottom={5}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size={Platform.OS === 'android' ? '10' : '8'}
                  _dark={{
                    color : item.highlight ? item.disabled ? "primary.400" : "primary.800" : item.disabled ? "coolGray.400" : "coolGray.100"
                  }}
                  _light={{
                    color : item.highlight ? item.disabled ? "primary.600" : "primary.400" : item.disabled ? "coolGray.300" : "coolGray.500"
                  }}
                  marginTop={item.highlight ? '-3' : '0'}
                  marginBottom={item.highlight ? 3 : 0 }
                />
              }
              _text={ item.highlight ? {
                color : item.disabled ? 
                  colorMode === 'dark' ? "primary.600" : "primary.400" : 
                  colorMode === 'dark' ? "primary.800" : "primary.400",
                width: 12,
                height: 10,
                textAlign: 'center'
              } : {
                color: item.disabled ? 
                  colorMode === 'dark' ? "primary.800" : "coolGray.400" : 
                  colorMode === 'dark' ? "primary.600" : "coolGray.600",
                width: 'full',
                height: 10,
                textAlign: 'center'
              }}
              paddingY={item.highlight ? 2 : 0} 
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