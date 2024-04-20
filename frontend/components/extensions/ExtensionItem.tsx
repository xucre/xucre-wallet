import { HStack, Avatar, Text, useColorMode, VStack } from "native-base";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { Extension } from "../../types/extensions";
import React from "react";

const ExtensionItemComponent = ({ metadata, navigation }: { metadata: Extension, navigation: { navigate: Function } }) => {
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
      <HStack alignItems="center" justifyContent="space-between" pr={3} py={0} my={0} borderRadius={15}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }} py={2}>
          <Avatar bg={metadata.color} size="lg" ml="10px" mb="10px" mr="1" mt="4px" source={{
            uri: avatar
          }} _image={{ borderRadius: 6 }} borderRadius={6} padding={1}>
          </Avatar>
          <VStack space={1}>
            <Text fontSize="md" bold>
              {metadata.title}
            </Text>
            <Text fontSize={'sm'}>
              {metadata.description}
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Pressable>
  )
}


const ExtensionItem = React.memo(ExtensionItemComponent);
export default ExtensionItem;