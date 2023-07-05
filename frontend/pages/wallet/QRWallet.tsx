// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
/* eslint-disable react-native/split-platform-components */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { Ionicons } from "@expo/vector-icons";
import {useIsFocused} from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import {
  Box,
  Button,
  Center,
  Icon,
  Image,
  Input,
  ScrollView,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { FlatList, PermissionsAndroid, TouchableOpacity, View } from "react-native";
import Communications from 'react-native-communications';
import Contact from 'react-native-contacts';
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";

import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getIconImage } from "../../service/api";
import { activeWallet, language as stateLanguage } from "../../service/state";



export default function QRWallet ({navigation, route}) {
  const { colorMode } = useColorMode();
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const initialFocusRef = React.useRef(null);

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
            console.log(con);
            const filteredContacts = con.filter((item) => item.phoneNumbers.length)
            filteredContacts.sort((a,b) => a.displayName > b.displayName) 
            setContactList(filteredContacts);
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  };

  const openPage = (pageName: string, param1: any, param2: any) => {
    switch (pageName) {
      case 'CodeCountry':
        navigation.navigate('CodeCountry',{param1,param2});
        break;
    }
  }

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);


  const eventFocus = (event) => {
    const eventFocus = event
    //console.log('evento focus entro', event)

    
  }

  const searchItem = (textSearch) => {
    const data = contactList;
    const dataC = contactList;

    //console.log('data',data)
    //console.log('letra',textSearch)

    if(textSearch){
      const newData = data.filter(item => {
        const itemData = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
        const textData = textSearch.toUpperCase();
        //console.log(itemData)
        //console.log(textData)
  
        return itemData.indexOf(textData) > -1
      })
      //console.log('newDta',newData)
      setContactList(newData);
    }else{
      //console.log('entro else', dataC)
      getPermission();
    }
  }

  const copyToClipboard = () => {
    console.log('copyToClipboard', _wallet.wallet.address);
    Clipboard.setStringAsync(String(_wallet.wallet.address));
    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };

  const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/whatsapp.png'
  return (
    <ScrollView horizontal={false} style={{flex: 1}}>
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        height: '100%',
        width: '100%', 
        }}>
    <DashboardLayout title={_wallet.name} >
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
          <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
              color: "#fff"
          }}>
            <Button onPress={copyToClipboard} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{_wallet.wallet.address}</Text></Button>
          </Tooltip> 
        </Center>

        
        <View style={{backgroundColor: colorMode === 'dark' ? '#1b1e24' : '#fff', flex: 1}}>

        <VStack w="100%" space={5} alignSelf="center">
        <Input placeholder="Search" variant="filled" marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}  
        onChangeText={(text) => {searchItem(text)}} onFocus={(event) => {eventFocus(event)}}/>
      </VStack>

      
      <FlatList
        data={contactList}
        horizontal={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                borderColor: colorMode === 'dark' ? Color.white : Color.black,
                borderRadius: 10,
                borderWidth: 1,
                flexDirection: 'row',
                height: 70,
                justifyContent: 'space-between',
                marginTop: 10,
                width: '90%',
              }}
              onPress={()=>{
                const walletA = _wallet.wallet.address
                openPage('CodeCountry', item, walletA)
                //<CodeCountry navigation={navigation} route={item}/>
               /*  const walletA = _wallet.wallet.address
                whatsapp(item, 'shareqrcode', 'en_US', {param1: 'www.google.com', param2: walletA}, translations[language].QRWallet.toast_send); */
              }}
              
              >

              <View style={{alignItems: 'center',flexDirection: 'row'}}>

                <Image
                  source={{
                    uri:  'https://cdn-icons-png.flaticon.com/512/1177/1177568.png',
                  }}
                  style={{height: 40, marginLeft: 15, width: 40}}
                  alt="logo"
                />
                <View style={{padding: 10}}>
                  <Text style={{color: colorMode === 'dark' ? Color.white : Color.black}}>{item.displayName}</Text>
                  <Text style={{color: colorMode === 'dark' ? Color.white : Color.black, marginTop: 4}}>
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
    </ScrollView>
    </ScrollView>
  )
}