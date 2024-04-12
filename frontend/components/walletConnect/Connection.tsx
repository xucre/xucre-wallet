import { MaterialIcons } from "@expo/vector-icons";
import {
  Avatar,
  Center,
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
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import GuestLayout from "../../layouts/GuestLayout";
import { language as stateLanguage } from "../../service/state";
import { truncateStringStart_old } from "../../service/utility";
import { signClient } from "../../service/walletConnect";

export default function Connection({ metadata, getPairs }: { metadata: any, getPairs: Function }) {
  //const address = metadata.wallet.address;

  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();

  const removePair = async () => {
    await signClient.core.pairing.disconnect({ topic: metadata.topic });
    getPairs();
  }

  useEffect(() => {
    console.log(metadata);
  }, [])
  if (!metadata) return (<></>)
  return (
    <HStack alignItems="center" justifyContent="space-between" p={3} my={2} borderRadius={25} _dark={{ bgColor: Color.gray_400 }} _light={{ bgColor: Color.lightgray_100 }}>
      <HStack alignItems="center" space={{ base: 3, md: 6 }}>
        <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" m={2} source={{
          uri: metadata?.peerMetadata?.icons[0] || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
        }} />
        <VStack>
          <Text color={colorMode === 'dark' ? Color.white : Color.black}>{metadata?.peerMetadata?.name}</Text>
          <Text color={'gray.500'}>{truncateStringStart_old(metadata?.topic, 25)}</Text>
        </VStack>
      </HStack>
      <HStack alignItems="center" space={{ base: 2 }}>
        <Tooltip label="More Options" openDelay={500}>
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
            <Menu.Item onPress={() => { removePair() }}><Text>{translations[language as keyof typeof translations].Connections.delete_button}</Text></Menu.Item>
          </Menu>
        </Tooltip>
      </HStack>
    </HStack>
  )
}