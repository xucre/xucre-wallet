import { HStack, Avatar, Text, useColorMode, VStack, Button, IconButton } from "native-base";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { Extension } from "../../types/extensions";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
const pages = ["Swap", "Ramp", "Ramp BTC"];
const DappHeaderComponent = ({ page, navigation, webViewRef }: { webViewRef: any, page: String, navigation: { navigate: Function } }) => {
  const { colorMode } = useColorMode();

  const openNetwork = (_page: string) => {
    if (_page !== page) {
      navigation.navigate(_page);
    }
  }


  const onRefresh = () => {
    if (webViewRef.current) {

      webViewRef.current.clearCache(true)
      webViewRef.current.reload();
    }
  }

  return (
    <HStack justifyContent={'space-around'} alignItems="center" px={0} py={2} bg={colorMode === 'dark' ? 'trueGray.900' : 'trueGray.100'}>
      <></>
      <Button.Group isAttached colorScheme={'trueGray'} mx={{
        base: "auto",
        md: 0
      }} size="sm" mb={2}>
        <Button variant={page === 'SwapToken' ? 'solid' : 'outline'} onPress={() => openNetwork('SwapToken')} aria-label="Swap Token">{pages[0]}</Button>
        <Button variant={page === 'BuyToken' ? 'solid' : 'outline'} onPress={() => openNetwork('BuyToken')} aria-label="Buy Token">{pages[1]}</Button>
        {/*<Button variant={page === 'BuyTokenBTC' ? 'solid' : 'outline'} onPress={() => openNetwork('BuyTokenBTC')} aria-label="Buy Token Bitcoin">{pages[2]}</Button>*/}
      </Button.Group>
      <IconButton
        _icon={{
          as: MaterialIcons,
          name: "refresh"
        }}
        onPress={() => onRefresh()}
        variant={'ghost'}
        colorScheme={'text'}
        size="md"
        aria-label="Refresh Page" />
    </HStack>

  )
}


const DappHeader = React.memo(DappHeaderComponent);
export default DappHeader;