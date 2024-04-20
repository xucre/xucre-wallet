import { HStack, Avatar, Text, useColorMode, VStack, Badge, Box } from "native-base";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { Extension } from "../../types/extensions";
import React from "react";
import { language as stateLanguage } from "../../service/state";
import { useRecoilState } from "recoil";
import translations from "../../assets/translations";

const ExtensionItemComponent = ({ metadata, navigation }: { metadata: Extension, navigation: { navigate: Function } }) => {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const openExtension = async () => {
    //viewNetwork();
    navigation.navigate(metadata.page);
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
      <HStack alignItems="center" justifyContent="space-between" pr={3} py={0} my={0} borderRadius={15} width={'full'}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }} py={2} width={'container'}>
          <Avatar bg={metadata.color} size="lg" ml="10px" mb="10px" mr="1" mt="4px" source={{
            uri: avatar
          }} _image={{ borderRadius: 6 }} borderRadius={6} padding={1.5}>
          </Avatar>
          <VStack space={0} flex={1}>
            <HStack alignItems={'center'} justifyItems={'space-between'} width={'full'}>
              <Box flex={2}>
                <Text fontSize="md" bold>
                  {metadata.title}
                </Text>
              </Box>
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
    </Pressable>
  )
}


const ExtensionItemSmall = React.memo(ExtensionItemComponent);
export default ExtensionItemSmall;