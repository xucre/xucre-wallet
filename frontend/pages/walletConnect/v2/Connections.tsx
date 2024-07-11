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

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { language as stateLanguage } from "../../../service/state";
import { truncateStringStart, truncateStringStart_old } from "../../../service/utility";
import { useSignClient } from "../../../hooks/useSignClient";

export default function Connections({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [request, setRequest] = useState({} as any);
  const [pairings, setPairings] = useState([] as any[]);
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const signClient = useSignClient();
  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _pairings = await getPairs(true);
      if (isMounted) setPairings(_pairings);
    }
    runAsync();
    return () => { isMounted = false }
  }, []);

  const getPairs = async (save: boolean) => {
    const _pairings = signClient.core.pairing.getPairings();
    if (save) setPairings(_pairings);
    return _pairings;
  }

  const Pair = ({ metadata }: { metadata: any }) => {
    //const address = metadata.wallet.address;
    useEffect(() => {
      const runAsync = async () => {
        await signClient.core.pairing.ping({ topic: metadata.topic })
      }
      runAsync();
    }, [metadata])
    const removePair = async () => {
      await signClient.core.pairing.disconnect({ topic: metadata.topic });
      getPairs(true);
    }
    if (!metadata) return (<></>)
    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} my={4} borderRadius={25} _dark={{ bgColor: Color.darkgray_200 }} _light={{ bgColor: Color.gray_200 }}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Avatar bg={colorMode === 'dark' ? Color.darkgray_200 : Color.gray_200} size="md" m={2} source={{
            uri: metadata?.peerMetadata?.icons[0] || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
          }} />
          <VStack>
            <Text color={colorMode === 'dark' ? Color.white : Color.black}>{metadata.peerMetadata.name}</Text>
            <Text color={'gray.500'}>{truncateStringStart_old(metadata.topic, 25)}</Text>
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

  return (
    <GuestLayout>
      <ScrollView>
        <VStack
          _light={{ backgroundColor: Color.white }}
          _dark={{ backgroundColor: Color.black }}
        >
          <VStack space={5} py={4}>
            {
              pairings.map((val, i) => {
                return (
                  <Pair metadata={val} key={'Pair' + i} />
                )
              })
            }
          </VStack>
        </VStack>
      </ScrollView>
    </GuestLayout>
  );
}