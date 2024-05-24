/* eslint-disable sort-keys */
/* eslint-disable import/order */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Color } from "../../../GlobalStyles";

import {
  Avatar,
  Box,
  Button,
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
import { Network } from '../../service/network';
import { useMixpanel } from "../../hooks/useMixpanel";

export default function SelectNetwork({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [, setSelectedNetwork] = useRecoilState(selectedNetwork);
  const [networks, setNetworks] = useRecoilState(networkList);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  const [tokenImage, setTokenImage] = useState('');
  const mixpanel = useMixpanel();
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _networks = await getNetworks();
      await mixpanel.track("view_page", { "page": "Select Network" });
      if (Array.isArray(_networks)) {
        if (isMounted) setNetworks(_networks);
      }
    }
    runAsync();
    return () => { isMounted = false }
  }, [tokenImage])

  const createNetwork = () => {
    navigation.navigate('CreateNetwork');
  }

  const viewNetwork = () => {
    navigation.navigate('ViewNetwork');
  }

  const getIconNetwork = async (metadata: any) => {
    try {
      if (metadata && metadata.symbol) {
        const img = await getIconImage(metadata.symbol.toLowerCase());
        return img
      }

    } catch (err) {
      //
    }

  }

  const _NetworkItem = ({ metadata }: { metadata: Network }) => {
    const selectNetwork = async () => {
      setActiveNetwork(metadata);
      storeActiveNetwork(metadata);
      //viewNetwork();
    }

    const openNetwork = () => {
      setSelectedNetwork(metadata);
      viewNetwork();
    }

    const removeNetwork = async () => {
      const result = await deleteNetwork(metadata);
      const _networks = await getNetworks();
      if (Array.isArray(_networks)) {
        setNetworks(_networks);
      } else {
        setNetworks([]);
      }
    }


    const isActiveNetwork = _activeNetwork.chainId === metadata.chainId;

    const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/' + metadata.symbol.toLowerCase() + '.png' || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png';

    return (
      <HStack alignItems="center" justifyContent="space-between" pr={3} py={1} borderRadius={15} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
        <Pressable onPress={() => { selectNetwork() }}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }}>
            <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" ml="10px" mb="10px" mr="1" mt="4px" source={{
              uri: avatar
            }} >
              {isActiveNetwork && <Avatar.Badge bg="green.500" />}
            </Avatar>
            <Text fontSize="md" bold>
              {metadata.name}
            </Text>
          </HStack>
        </Pressable>
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
              <Menu.Item onPress={() => { selectNetwork() }}><Text>{translations[language as keyof typeof translations].SelectNetwork.select_button}</Text></Menu.Item>
              <Menu.Item onPress={() => { removeNetwork() }}><Text>{translations[language as keyof typeof translations].SelectNetwork.delete_button}</Text></Menu.Item>

            </Menu>
          </Tooltip>
        </HStack>
      </HStack>
    )
  }
  const NetworkItem = React.memo(_NetworkItem)
  return (
    <GuestLayout >

      <ScrollView height={'full'}>
        <Box
          _light={{ backgroundColor: Color.white }}
          _dark={{ backgroundColor: Color.black }}

          width={'100%'}
        >
          <Text style={{ color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={15} >{translations[language as keyof typeof translations].SelectNetwork.select_network}</Text>

          <VStack space={3} py={4}>
            {
              networks.map((val, i) => {
                return (
                  <Box key={val.name + i} px={4} py={0} >
                    <NetworkItem metadata={val} />
                  </Box>
                )
              })
            }
          </VStack>

          <Button justifyContent={'start'} mx={5} width={'90%'} mt={10} colorScheme={colorMode === 'dark' ? 'muted' : 'muted'} _dark={{ bgColor: 'coolGray.800', color: 'white' }} _light={{ bgColor: 'coolGray.300' }} onPress={createNetwork}>
            <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, padding: 4 }} bold>{translations[language as keyof typeof translations].SelectNetwork.new_button}</Text>
          </Button>
        </Box>
      </ScrollView>
    </GuestLayout>
  )
}
