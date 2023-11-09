
import { Box, Center, Stack, StatusBar, useColorMode } from 'native-base';
import React from 'react';

import { Color } from '../../GlobalStyles';
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
        _light={{ bg: Color.white }}
        _dark={{ bg: Color.black }}
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        _dark={{ bg: Color.black }}
        _light={{ bg: Color.white }}
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
