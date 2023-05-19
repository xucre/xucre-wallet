/* eslint-disable react-native/split-platform-components */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {useIsFocused} from '@react-navigation/native';
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  ColorMode,
  Divider,
  Drawer,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Icon as IconElement,
  Image,
  Input,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { FlatList, Linking, PermissionsAndroid, TouchableOpacity, View } from "react-native";
import Communications from 'react-native-communications';
import Contact from 'react-native-contacts';
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeWallet, language as stateLanguage } from "../../service/state";
import whatsapp from "../../service/whatsapp";



export default function QRWallet ({navigation, route}) {
  const { colorMode } = useColorMode();

  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    }
  }, [_wallet]);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const [contactList, setContactList] = useState([]);
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
            console.log(con);
            const filteredContacts = con.filter((item) => item.phoneNumbers.length)
            setContactList(filteredContacts);
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  };

  const searchItem = (textSearch) => {
    const data = contactList;
    const dataC = contactList;

    console.log('data',data)
    console.log('letra',textSearch)

    if(textSearch){
      const newData = data.filter(item => {
        const itemData = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
        const textData = textSearch.toUpperCase();
        console.log(itemData)
        console.log(textData)
  
        return itemData.indexOf(textData) > -1
      })
      console.log('newDta',newData)
      setContactList(newData);
    }else{
      console.log('entro else', dataC)
      getPermission();
    }
  }

  return (
    <DashboardLayout title={_wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
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
          <Text>{_wallet.wallet.address}</Text>
        </Center>
        <View style={{backgroundColor: '#000', flex: 1}}>

        <VStack w="100%" space={5} alignSelf="center">
        <Input placeholder="Search" variant="filled" marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}  
        onChangeText={(text) => {searchItem(text)}}/>
      </VStack>

      <FlatList
        data={contactList}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                borderColor: '#fff',
                borderRadius: 10,
                borderWidth: 1,
                flexDirection: 'row',
                height: 70,
                justifyContent: 'space-between',
                marginTop: 10,
                width: '90%',
              }}
              onPress={() => {
                // eslint-disable-next-line sort-keys
                whatsapp(item, 'mediatest', 'en', {amount: 54, account: 111111});
              }}
              
              >

              <View style={{alignItems: 'center',flexDirection: 'row'}}>

                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/1177/1177568.png',
                  }}
                  style={{height: 40, marginLeft: 15, width: 40}}

                />
                <View style={{padding: 10}}>
                  <Text style={{color: '#fff'}}>{item.displayName}</Text>
                  <Text style={{color: '#fff', marginTop: 4}}>
                    {item.phoneNumbers[0].number}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', paddingRight: 15}}>
                <TouchableOpacity
                  onPress={() => {
                    const url = Communications.text(
                      item.phoneNumbers[0].number,
                    );
                  }}>
                  <Image
                    source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2335/2335318.png',
                }}
                    style={{
                      height: 40,
                      marginRight: 20,
                      width: 40,
                    }}
                  />
                </TouchableOpacity>
{/*                  <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`https://web.whatsapp.com/send?phone=${item.phoneNumbers[0].number}`);
                  }}> 
                   <Image
                    source={require('../images/call.png')}
                    style={{width: 20, height: 20, tintColor: '#fff'}}
                  /> 
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
      </Box>
    </DashboardLayout>
  )
}