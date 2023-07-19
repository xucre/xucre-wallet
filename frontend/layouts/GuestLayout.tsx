
import { Box, Center, Stack, StatusBar, useColorMode } from 'native-base';
import React from 'react';
type GuestLayoutProps = {
  readonly children: React.ReactNode
};

export default function GuestLayout(props: GuestLayoutProps) {
  const {
    colorMode
  } = useColorMode();
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colorMode === 'light' ? 'dark-content' : 'light-content'}
      />
      <Box
        safeAreaTop
        _light={{ bg: 'white' }}
        _dark={{ bg: '#1b1e24' }}
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        _dark={{ bg: '#1b1e24' }}
        _light={{ bg: 'white' }}
      >
        <Stack
          w="100%"
          maxW={{ md: '1016' }}
          flex={{ base: '1', md: undefined }}
          direction={{ base: 'column', md: 'row' }}
        >
          {props.children}
        </Stack>
      </Center>
    </>
  );
}
