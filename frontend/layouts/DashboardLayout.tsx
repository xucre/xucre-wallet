/* eslint-disable react-native/no-inline-styles */

import { AntDesign, FontAwesome } from '@expo/vector-icons';
import {
  Box,
  Button,
  Divider,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  StatusBar,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from 'native-base';
import React from 'react';

import { Color } from '../../GlobalStyles';


type DashboardLayoutProps = {
  readonly scrollable?: boolean;
  readonly displayScreenTitle?: boolean;
  readonly displaySidebar?: boolean;
  readonly displayBackButton?: boolean;
  readonly showIcons?: boolean;
  readonly displaySearchButton?: boolean;
  readonly displayNotificationButton?: boolean;
  readonly displayMenuButton?: boolean;
  readonly displayAlternateMobileHeader?: boolean;
  readonly maxWidth?: number;
  readonly header?: {
    readonly searchbar: boolean;
  };
  readonly mobileHeader?: {
    readonly backButton: boolean;
  };
  readonly title: string;
  readonly subTitle?: string;
  readonly children: React.ReactNode;
  readonly showGroupInfoHeader?: boolean;
  readonly displayBackIcon?: boolean;
  readonly rightPanelMobileHeader?: boolean;
};

type MainContentProps = DashboardLayoutProps;

type MobileHeaderProps = {
  readonly title: string;
  readonly subTitle?: string;
  readonly backButton: boolean;
  readonly rightPanel?: boolean;
};

type HeaderProps = {
  readonly title: string;
  readonly subTitle?: string;
  readonly menuButton: boolean;
  readonly searchbar: boolean;
};

function MainContent(props: MainContentProps) {
  return (
    <VStack maxW={props.maxWidth} flex={1} width="100%">
      {props.displayScreenTitle && (
        <Hidden till="md">
          <HStack mb="4" space={4}>
            <Pressable
              onPress={() => {
                console.log('hello');
              }}
            >
              <Icon
                size="6"
                pt="0.5"
                as={AntDesign}
                name={'arrowleft'}
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              />
            </Pressable>
            <VStack>
              <Text
                fontSize="lg"
                fontWeight="medium"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              >
                {props.title}
              </Text>
              <Text
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                fontSize="sm"
                fontWeight="normal"
              >
                {props.subTitle}
              </Text>
            </VStack>
          </HStack>
        </Hidden>
      )}
      {props.children}
    </VStack>
  );
}

export default function DashboardLayout({
  displayScreenTitle = true,
  displaySidebar = true,
  header = {
    searchbar: false,
  },
  maxWidth = 1016,
  mobileHeader = {
    backButton: true,
  },
  ...props
}: DashboardLayoutProps) {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  const {
    colorMode
  } = useColorMode();
  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colorMode === 'light' ? 'dark-content' : 'light-content'}
      />
      <Box
        _light={{ bg: Color.white }}
        _dark={{ bg: Color.black }}
      />
      <VStack
        flex={1}
        _light={{ bg: Color.white }}
        _dark={{ bg: Color.black }}
      >
        <Box
          flex={1}
          safeAreaBottom
          flexDirection={{ base: 'column', md: 'row' }}
          _light={{
            bg: Color.white,
            borderTopColor: 'coolGray.200',
          }}
          _dark={{
            bg: Color.black,
            borderTopColor: 'coolGray.700',
          }}
        >

          <Hidden till="md">
            <ScrollView
              flex={1}
              p={{ md: 8 }}
              contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <MainContent
                {...props}
                displayScreenTitle={displayScreenTitle}
                maxWidth={maxWidth}
              />
            </ScrollView>
          </Hidden>

          <Hidden from="md">
            <MainContent {...props} displayScreenTitle={displayScreenTitle} />
          </Hidden>
        </Box>
      </VStack>
    </>
  );
}
