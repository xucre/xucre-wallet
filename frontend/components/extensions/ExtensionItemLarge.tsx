import { HStack, Image, Avatar, Text, useColorMode, VStack, ZStack, Box, Badge } from "native-base";
import { useState, useEffect } from "react";
import { Linking, Pressable } from "react-native";
import { Extension } from "../../types/extensions";
import React from "react";
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { useRecoilState } from "recoil";
import { language as stateLanguage, } from "../../service/state";
import translations from "../../assets/translations";

const ExtensionItemComponent = ({ metadata, navigation }: { metadata: Extension, navigation: { navigate: Function } }) => {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();

  const openExtension = async () => {
    if (metadata.externalUrl) {
      const supported = await Linking.canOpenURL(metadata.externalUrl);
      if (supported) {
        await Linking.openURL(metadata.externalUrl);
      }
    } else {
      navigation.navigate(metadata.page);
    }
  }

  const openNetwork = () => {
  }

  const [avatar, setAvatar] = useState('https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png');
  useEffect(() => {
    if (metadata.logo) {
      setAvatar(metadata.logo);
    }
  }, [metadata])

  return (

    <Pressable onPress={() => { openExtension() }}>
      <VStack mt="3" width={'full'}>
        <Box bg={{
          linearGradient: {
            colors: [metadata.color, colorMode === 'dark' ? 'black' : 'white'],
            start: [0, 0],
            end: [0, 1]
          }
        }} width={'full'} justifyContent={'start'} alignItems={'center'} rounded="lg" >
          <Image source={{ uri: metadata.featuredImage }} alt="image base" resizeMode={'contain'} width={'5/6'} height={'5/6'} top={0} />
        </Box>
        <HStack alignItems="center" justifyContent="space-between" pr={3} py={0} my={0} mt={-60} borderRadius={15}>
          <HStack alignItems="center" space={{ base: 3, md: 6 }} py={2}>
            <Avatar bg={metadata.color} size="lg" ml="10px" mb="10px" mr="1" mt="4px" source={{
              uri: avatar
            }} _image={{ borderRadius: 6 }} borderRadius={6} padding={1}>
            </Avatar>
            <VStack space={1} flex={1}>
              <HStack alignItems={'center'} justifyItems={'space-between'} width={'full'}>
                <Box flex={2}></Box>
                <Box flex={1}>
                  <Badge colorScheme="primary" variant="solid" borderRadius={100} p={0} px={2} display={'flex'} _text={{ fontWeight: 'bold', fontSize: 16 }} _dark={{ _text: { color: 'black' } }}>{translations[language as keyof typeof translations].ui.open}</Badge>
                </Box>
              </HStack>
              <Text fontSize={'sm'}>
                {metadata.description}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </VStack>
    </Pressable>
  )
}


const ExtensionItemLarge = React.memo(ExtensionItemComponent);
export default ExtensionItemLarge;