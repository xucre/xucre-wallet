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
        justifyContent="space-between"
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
            item.highlight ? 
            <Button
              key={index}
              variant="ghost"
              colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
              _stack={{
                flexDirection: 'column',
              }}
              marginBottom={5}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size="10"
                  _dark={{
                    color : item.disabled ? "primary.800" : "primary.600"
                  }}
                  _light={{
                    color : item.disabled ? "primary.500" : "primary.600"
                  }}
                  marginTop='-3'
                  marginBottom={3}
                />
              }
              _text={{
                color : item.disabled ? colorMode === 'dark' ? "primary.800" : "primary.500" : colorMode === 'dark' ? "primary.800" : "primary.600"
              }}
              paddingY={2}
              onPress={() => {openPage(item.text)}}
            >
              {item.text}
            </Button> :
            <Button
              key={index}
              variant="ghost"
              colorScheme={colorMode === 'dark' ? 'coolGray' : 'coolGray'}
              _stack={{
                flexDirection: 'column',
              }}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name={item.name}
                  size="5"
                  _dark={{
                    color: item.disabled ? "coolGray.400" : "coolGray.100"
                  }}
                  _light={{
                    color: item.disabled ? "coolGray.300" : "coolGray.500"
                  }}                
                />
              }
              _dark={{
                color: item.disabled ? "coolGray.400" : "coolGray.100"
              }}              
              _light={{
                color: item.disabled ? "coolGray.300" : "coolGray.500"
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