/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* eslint-disable react-native/split-platform-components */
/* eslint-disable react-native/no-inline-styles */
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Icon,
  Image,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack
} from "native-base";
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, TouchableOpacity, View, Platform, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { Contact, getAll } from 'react-native-contacts';
import Geolocation from 'react-native-geolocation-service';
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import ContactIcon from '../../assets/images/contact-icon.png';
import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getIconImage } from "../../service/api";
import { activeWallet, language as stateLanguage } from "../../service/state";
import CopyButton from "../../components/wallet/CopyButton";
import QRButton from "../../components/wallet/QRButton";

export default function QRWallet({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const [local, setlocal] = useState(false);
  const [location, setLocation] = useState({} as Geolocation.GeoPosition);
  const [lat, setlat] = useState(0);
  const [lng, setlng] = useState(0);
  const { colorMode } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const initialFocusRef = React.useRef(null);


  const [contactList, setContactList] = useState([] as Contact[]);
  const [allContacts, setAllContacts] = useState([] as Contact[]);
  const [viewWalletQR, setViewWalletQR] = useState(Boolean);
  const [showModal, setShowModal] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    let isMounted = true;
    const runAsyncPermission = async () => {
      const filteredContacts = await getPermission(false);
      if (isMounted) {
        if (allContacts.length === 0) setAllContacts(filteredContacts);
        setContactList(filteredContacts);
      }
    };

    const runAsyncLocation = async () => {
      const position = await getLocation(false);
      if (isMounted) {
        setLocation(position);
        if (position.coords) {
          setlat(position.coords.latitude)
          setlng(position.coords.longitude)
        }
      }
      const localJson = await getLocal();
      if (isMounted) { setlocal(localJson) }
    }

    runAsyncPermission();
    runAsyncLocation();
    return () => { isMounted = false }
  }, [isFocused]);

  const getPermission = async (save: boolean) => {
    if (Platform.OS === 'android') {
      const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        buttonPositive: 'Accept',
        message: 'This app would like to view your contacts.',
        title: 'Contacts',
      })
      if (res == 'granted') {
        const con = await getAll();
        const filteredContacts = con.filter((item) => item.phoneNumbers.length)
        filteredContacts.sort((a, b) => a.displayName > b.displayName ? 1 : -1)
        if (save) {
          if (allContacts.length === 0) setAllContacts(filteredContacts);
          setContactList(filteredContacts);
        }
        return filteredContacts;
      }
    } else if (Platform.OS === 'ios') {
      const con = await getAll();
      // work with contacts
      const filteredContacts = con.filter((item) => item.phoneNumbers.length)
      filteredContacts.sort((a, b) => a.displayName > b.displayName ? 1 : -1)
      if (save) {
        setAllContacts(filteredContacts);
        setContactList(filteredContacts);
      }
      return filteredContacts;
    }
    return [];
  };

  const getLocation = async (save: boolean) => {
    const res = await requestLocationPermission();
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          if (save) setLocation(position);
          if (save) setlat(position.coords.latitude)
          if (save) setlng(position.coords.longitude)
          return position;
        },
        error => { },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
      );
    }
    return {} as Geolocation.GeoPosition;
  };

  const getLocal = async () => {
    const url = 'http://api.geonames.org/countryCodeJSON?lat=' + lat + '&lng=' + lng + '&username=carevalo123'
    const response = await fetch(url)
    const _json = await response.json();
    return _json;
  }

  const openPage = (pageName: string, param1: any, param2: any, param3: any) => {
    switch (pageName) {
      case 'CodeCountry':
        navigation.navigate('CodeCountry', { param1, param2, param3 });
        break;
    }
  }

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask Me Later',
            buttonPositive: 'OK',
            message: 'Can we access your location?',
            title: 'Geolocation Permission',
          },
        );
        if (granted === 'granted') {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  // Transitions


  const eventFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const eventFocus = event


  }

  const searchItem = (textSearch: string) => {
    const data = allContacts;
    if (textSearch) {
      if (!data.length) return;
      const newData = data.filter(item => {
        const itemData = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
        const textData = textSearch.toUpperCase();
        return itemData.indexOf(textData) > -1
      })
      setContactList(newData);
    } else {
      getPermission(true);
    }
  }

  const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/whatsapp.png'
  return (
    <KeyboardAvoidingView h={{
      base: "full",
      lg: "full"
    }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Box style={{ flex: 1 }}>
        <VStack
          style={{
            height: '100%',
            width: '100%',
          }}>
          {/*<DashboardLayout title={_wallet.name} >*/}


          <Box
            _light={{ backgroundColor: Color.white }}
            _dark={{ backgroundColor: Color.black }}
            height={'100%'}
            safeAreaBottom
          >

            <Center mt={6}>
              {/*<Text variant={'lg'} mt={5}>{translations[language as keyof typeof translations]?.QRWallet.instructions}</Text>*/}

            </Center>

            <HStack justifyContent={'space-between'} marginX={5}>
              <Text variant={'lg'} mt={5} mb={2} bold fontSize={20}>{_wallet.name}</Text>
              <Button.Group>
                <QRButton address={_wallet.address} />
                <CopyButton address={_wallet.address} />
              </Button.Group>
            </HStack>

            <View style={{ backgroundColor: colorMode === 'dark' ? Color.black : Color.white, flex: 1 }}>

              <VStack w="100%" space={5} alignSelf="center">
                <Input placeholder="Search" variant="filled" h={'10'} marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                  onChangeText={(text) => { searchItem(text) }} onFocus={(event) => { eventFocus(event) }} />
              </VStack>

              <FlatList data={contactList} renderItem={({
                item
              }) => <Box key={item.recordID} ><TouchableOpacity style={{
                alignItems: 'center',
                alignSelf: 'center',
                borderColor: colorMode === 'dark' ? Color.white : Color.gray_100,
                borderRadius: 10,
                borderWidth: 1,
                flexDirection: 'row',
                height: 70,
                justifyContent: 'space-between',
                marginTop: 10,
                width: '90%',
              }}
              >
                <View style={{ alignItems: 'center', flexDirection: 'row' }} key={item.recordID}>

                  <Image
                    source={ContactIcon}
                    style={{ height: 40, marginLeft: 15, width: 40 }}
                    alt="logo"
                  />
                  <View style={{ padding: 10 }}>
                    <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black }}>{item?.displayName || item.givenName}</Text>
                    <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, marginTop: 4 }} >
                      {item?.phoneNumbers[0].number}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const walletA = _wallet.address
                    openPage('CodeCountry', item, walletA, local)
                  }}>
                  <Image
                    source={{
                      uri: avatar,
                    }}
                    style={{
                      height: 40,
                      marginRight: 20,
                      width: 40,
                    }}
                    alt="logo"
                  />
                </TouchableOpacity>

              </TouchableOpacity>

                </Box>}
                keyExtractor={item => item.recordID}
              />
            </View>
          </Box>
          {/*</DashboardLayout>*/}
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  )
}