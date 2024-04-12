import { MaterialIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Fab,
  FlatList,
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
import { signClient } from "../../service/walletConnect";
import { getAllNotifications } from "../../store/setting";
import Request from "../../components/walletConnect/Request";
import Connection from "../../components/walletConnect/Connection";
import { RefreshControl } from "react-native";
import ScannerButton from "../../components/walletConnect/ScannerButton";

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}: {
  tabName: string,
  currentTab: string,
  handleTabChange: Function
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'gray.700' : 'gray.700',
          }}
          _dark={{
            color: tabName === currentTab ? 'gray.100' : 'gray.100',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            marginBottom={-1}
            h="0.5"
          />
        )}
      </VStack>
    </Pressable>
  );
}

export default function ConnectionManagement({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const [pairings, setPairings] = useState([] as any[]);
  const [requests, setRequests] = useState([] as any[]);
  const [paringMap, setParingMap] = useState({} as any);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ConnectManagement.tab_list[0]);
  const tabList = translations[language as keyof typeof translations].ConnectManagement.tab_list;

  //{translations[language].ConnectionRequest.}
  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    const _requests = await getAllNotifications();
    const _pairings = signClient.core.pairing.getPairings();
    const _pairingMap = _pairings.reduce((returnVal: any, val: { topic: any; }, i: any) => {
      return { ...returnVal, [val.topic]: val };
    }, {})
    setRequests(_requests || []);
    setParingMap(_pairingMap);
    setPairings(_pairings);


  }

  const handleTabChange = (newTab: React.SetStateAction<string>) => {
    setCurrentTab(newTab);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getRequests();
    setRefreshing(false);
  }

  const onRefreshRequests = async () => {
    setRefreshing(true);
    await getRequests();
    setRefreshing(false);
  }

  return (
    <Box h={'full'} w={'full'} safeAreaBottom>
      <VStack
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
      >
        {/*<HStack justifyContent={'flex-end'} width={'full'} paddingX={4}>
        <ScannerButton navigation={navigation} />
      </HStack>*/}
        <HStack
          my={5}
          mx={5}
          borderBottomWidth={1}
          borderBottomColor={'gray.700'}
          w="90%"
          justifyContent="space-around"
          borderRadius="sm"
        >
          {
            tabList.map((tab: string, index: React.Key | null | undefined) => {
              return (
                <TabItem key={index} tabName={tab} currentTab={currentTab} handleTabChange={handleTabChange} />
              )
            })
          }
        </HStack>
        {currentTab == translations[language as keyof typeof translations].ConnectManagement.tab_list[0] && signClient &&
          <FlatList data={pairings} refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          } renderItem={
            ({ item, index }) => <Connection metadata={item} key={'Pair' + index} getPairs={onRefresh} />
          }
            keyExtractor={item => item.topic}
          />
        }


        {currentTab == translations[language as keyof typeof translations].ConnectManagement.tab_list[1] && signClient &&
          <FlatList data={requests} refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          } renderItem={
            ({ item, index }) => {
              const mdt = paringMap[item.topic];
              return <Request event={item} metadata={mdt} key={'Requests' + index} getRequests={onRefresh} />
            }
          }
            keyExtractor={item => item.id}
          />
        }

      </VStack>
      <Fab renderInPortal={false} shadow={2} size={'xs'} placement={'bottom-right'} icon={<ScannerButton navigation={navigation} />} />
    </Box>
  );
}