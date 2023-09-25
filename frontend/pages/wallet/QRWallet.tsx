/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
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
  Icon,
  Image,
  Input,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack
} from "native-base";
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, TouchableOpacity, View } from "react-native";
import Contact from 'react-native-contacts';
import Geolocation from 'react-native-geolocation-service';
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import ContactIcon from '../../assets/images/contact-icon.png';
import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getIconImage } from "../../service/api";
import { activeWallet, language as stateLanguage } from "../../service/state";




export default function QRWallet({ navigation, route }) {
  const [local, setlocal] = useState(false);
  const [location, setLocation] = useState(false);
  const [lat, setlat] = useState(String);
  const [lng, setlng] = useState(String);
  const { colorMode } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const initialFocusRef = React.useRef(null);


  const [contactList, setContactList] = useState([]);
  const [viewWalletQR, setViewWalletQR] = useState(Boolean);
  const [showModal, setShowModal] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {

    getPermission();
  }, [isFocused]);
  const getPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      // eslint-disable-next-line sort-keys
      message: 'This app would like to view your contacts.',
      // eslint-disable-next-line sort-keys
      buttonPositive: 'Please accept bare mortal',
    }).then(res => {
      if (res == 'granted') {
        Contact.getAll()
          .then(con => {
            // work with contacts
            const filteredContacts = con.filter((item) => item.phoneNumbers.length)
            filteredContacts.sort((a, b) => a.displayName > b.displayName)
            console.log(filteredContacts);
            setContactList(filteredContacts);

          })
          .catch(e => {
            //console.log(e);
          });
      }
    });
    getLocation()
  };


  const getLocation = () => {

    const result = requestLocationPermission();
    result.then(res => {
      //console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            //console.log('coordenadas c', position);
            setLocation(position);
            setlat(position.coords.latitude)
            setlng(position.coords.longitude)

            setTimeout(getLocal, 3000);
          },
          error => {
            // See error code charts below.
            //console.log(error.code, error.message);
            setLocation(false);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
        );
      }
    });
    //console.log('location c',location);
  };

  const getLocal = () => {
    const url = 'http://api.geonames.org/countryCodeJSON?lat=' + lat + '&lng=' + lng + '&username=carevalo123'
    fetch(url).then((response) => response.json()).then((json) => {
      setlocal(json)
      //console.log('getLocal',json)
    }).catch((error) => {
      console.error(error);
    });
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
      //console.log('granted', granted);
      if (granted === 'granted') {
        //console.log('You can use Geolocation');
        return true;
      } else {
        //console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);


  const eventFocus = (event) => {
    const eventFocus = event
    //console.log('evento focus entro', event)


  }

  const searchItem = (textSearch) => {
    const data = contactList;
    if (textSearch) {
      const newData = data.filter(item => {
        const itemData = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
        const textData = textSearch.toUpperCase();
        return itemData.indexOf(textData) > -1
      })
      setContactList(newData);
    } else {
      getPermission();
    }
  }

  const copyToClipboard = () => {
    //console.log('copyToClipboard', _wallet.wallet.address);
    Clipboard.setStringAsync(String(_wallet.wallet.address));
    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };


  const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/whatsapp.png'
  return (
    <ScrollView horizontal={false} style={{ flex: 1 }}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          height: '100%',
          width: '100%',
        }}>
        <DashboardLayout title={_wallet.name} >
          <Box
            _light={{ backgroundColor: Color.white }}
            _dark={{ backgroundColor: Color.black }}
            height={'100%'}
            safeAreaBottom
          >

            <Center mt={10} mb={6}>
              <QRCode
                size={256}
                style={{ height: "auto", marginLeft: 'auto', marginRight: 'auto', maxWidth: "100%", width: "100%", }}
                value={_wallet.wallet.address}
                viewBox={`0 0 256 256`}
              />
              <Text variant={'lg'} mt={5}>{translations[language].QRWallet.instructions}</Text>
              <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
                color: "#fff"
              }}>
                <Button onPress={copyToClipboard} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{_wallet.wallet.address}</Text></Button>
              </Tooltip>
            </Center>


            <View style={{ backgroundColor: colorMode === 'dark' ? Color.black : Color.white, flex: 1 }}>

              <VStack w="100%" space={5} alignSelf="center">
                <Input placeholder="Search" variant="filled" marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                  onChangeText={(text) => { searchItem(text) }} onFocus={(event) => { eventFocus(event) }} />
              </VStack>
              {/* Replace ScrollView with FlatList */}

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
                      <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black }}>{item?.displayName}</Text>
                      <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, marginTop: 4 }} >
                        {item?.phoneNumbers[0].number}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      const walletA = _wallet.wallet.address
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
              {
                /*
                  <ScrollView>
                    {contactList.map((contactList) => (
                      <Box key={contactList.recordID}><TouchableOpacity style={{
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
                        <View style={{ alignItems: 'center', flexDirection: 'row' }} key={contactList.recordID}>

                          <Image
                            source={ContactIcon}
                            style={{ height: 40, marginLeft: 15, width: 40 }}
                            alt="logo"
                          />
                          <View style={{ padding: 10 }}>
                            <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black }}>{contactList.displayName}</Text>
                            <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, marginTop: 4 }} >
                              {contactList.phoneNumbers[0].number}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const walletA = _wallet.wallet.address
                            openPage('CodeCountry', contactList, walletA, local)
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

                      </Box>
                    ))}
                  </ScrollView>
                */
              }
            </View>
          </Box>
        </DashboardLayout>
      </ScrollView>
    </ScrollView>
  )
}