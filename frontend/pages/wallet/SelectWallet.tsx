/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Menu,
  Pressable,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
import React, {} from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import GuestLayout from '../../layouts/GuestLayout';
import { activeWallet, AppWallet, language as stateLanguage, walletList } from "../../service/state";
import { truncateStringStart } from "../../service/utility";
import { storeActiveWallet, WalletInternal } from "../../store/wallet";

export default function SelectWallet ({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const {
    colorMode
  } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [walletState, setWalletState] = useRecoilState(walletList);
  const [, setActiveWallet] = useRecoilState(activeWallet);
  
  const createWallet = () => {
    navigation.navigate('NewWallet');
  }

  const viewWallet = () => {
    navigation.navigate('ViewWallet');
  }

  const WalletItem = ({metadata} : {metadata: AppWallet}) => {
    const selectWallet = () => {
      setActiveWallet(metadata);
      storeActiveWallet(metadata);  
    }

    const openWallet = () => {      
      selectWallet();
      viewWallet();
    }
    return (
      <>
        {
          metadata !== undefined && 
          <HStack alignItems="center" justifyContent="space-between" >
            
          <Pressable onPress={openWallet}>
            <HStack alignItems="center" space={{ base: 3, md: 6 }}>
              <VStack space={1}>
                  <Text fontSize="md" bold>
                    {metadata.name}
                  </Text>
              </VStack>
              
              <Text color="coolGray.500">{truncateStringStart(metadata.address, 20)}</Text>     
            </HStack>
          </Pressable>
          <HStack alignItems="center" space={{ base: 2 }}>       
            <Tooltip label={translations[language as keyof typeof translations].SelectWallet.select_button_tooltip} openDelay={500}>
              <Menu w="190" trigger={triggerProps => {
                return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                  <Icon
                    as={MaterialIcons}
                    name="more-vert"
                    size="6"
                    color="coolGray.500"
                  />
                </Pressable>;
                }}
              >                
                <Menu.Item onPress={() => {selectWallet()}}><Text>{translations[language as keyof typeof translations].SelectWallet.select_button}</Text></Menu.Item>                
              </Menu>
            </Tooltip>
            
          </HStack>
        </HStack>
        }

      </>
      
    )
  }

  return (
    <GuestLayout>
      <Box         
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        height={'100%'}
      >
        <VStack space={4} height={'90%'}>
          {
            walletState.map((val, i) => {
              if (val) {
                return (
                  <Box key={val.name+i} px={4} py={1}>
                    <WalletItem metadata={val} /> 
                    {(i+1) !== walletState.length && 
                      <Divider orientation={'horizontal'} mt={4} _light={{
                        bg: "muted.800"
                      }} _dark={{
                        bg: "muted.300"
                      }} />
                    }
                    
                  </Box>
                )
              }           
            })
          }
        </VStack>
        
        <Button onPress={createWallet} style={{borderRadius: 100, marginLeft:10, marginRight:10}}  colorScheme={colorMode === 'dark' ? 'primary': 'tertiary'}><Text color={colorMode === 'dark' ? 'darkText' : 'lightText'}>{translations[language as keyof typeof translations].SelectWallet.new_button}</Text></Button>
      </Box>
    </GuestLayout>
  )
}