import { HStack, VStack, Tooltip, Menu, Icon, Text, Avatar, useColorMode } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { AppWallet, language as stateLanguage } from "../../service/state";
import { truncateStringStart } from "../../service/utility";
import { useRecoilState } from "recoil";
import translations from "../../assets/translations";

import Multichain_dark from "../../assets/images/new_multii_logo_white.png";
import Multichain_light from "../../assets/images/new_multii_logo_black.png";
import Eth from "../../assets/images/eth_logo.png";
import Eth_dark from "../../assets/images/eth_logo_dark.png";
import { Color } from '../../../GlobalStyles';


export default function WalletItem({ metadata, setActiveWallet, storeActiveWallet, viewWallet, exportWallet }: { metadata: AppWallet, setActiveWallet: Function, storeActiveWallet: Function, viewWallet: Function, exportWallet: Function }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
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
              <Avatar size="sm" source={
                colorMode === 'dark' ? Eth_dark : Eth
              } bg={Color.transparent} _image={{

              }} />
              <VStack space={1}>
                <Text fontSize="md" bold>
                  {metadata.name}
                </Text>
              </VStack>
            </HStack>
          </Pressable>
          <HStack alignItems="center" space={{ base: 2 }}>
            <Pressable onPress={openWallet}>
              <Text color="coolGray.500">{truncateStringStart(metadata.address, 7)}</Text>
            </Pressable>
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
                <Menu.Item onPress={() => { selectWallet() }}><Text>{translations[language as keyof typeof translations].SelectWallet.select_button}</Text></Menu.Item>
                {<Menu.Item onPress={() => { exportWallet(metadata.address) }}><Text>{translations[language as keyof typeof translations].SelectWallet.export_button}</Text></Menu.Item>}
              </Menu>
            </Tooltip>

          </HStack>
        </HStack>
      }

    </>

  )
}