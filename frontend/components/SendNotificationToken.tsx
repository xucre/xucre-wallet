/* eslint-disable react-native/split-platform-components */
/* eslint-disable import/order */
import {useIsFocused} from '@react-navigation/native';
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
import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import { language as stateLanguage } from "../service/state";
import { useRecoilState } from "recoil";
import {
    FlatList,
    PermissionsAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import Contact from "react-native-contacts";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";


export default function SendNotificationToken({ navigation, route }) {

    console.log('route ', route)

    const { colorMode } = useColorMode();
    const [language] = useRecoilState(stateLanguage);
    const [contactList, setContactList] = useState([]);
    const isFocused = useIsFocused();
    useEffect(() => {
        getPermission();
      }, [isFocused]);

    const getPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: "Contacts",
            // eslint-disable-next-line sort-keys
            message: "This app would like to view your contacts.",
            // eslint-disable-next-line sort-keys
            buttonPositive: "Please accept bare mortal",
        }).then((res) => {
            if (res == "granted") {
                Contact.getAll()
                    .then((con) => {
                        // work with contacts
                        console.log(con);
                        const filteredContacts = con.filter(
                            (item) => item.phoneNumbers.length
                        );
                        filteredContacts.sort((a, b) => a.displayName > b.displayName ? 1 : -1);
                        setContactList(filteredContacts);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        });
    };

    const openPage = (pageName: string, param1: any, param2: any, param3: any, param4: any, param5: any ) => {
        switch (pageName) {
          case 'CodeCountry':
            navigation.navigate('CodeCountry',{param1,param2,param3,param4,param5});
            break;
        }
      }

    const avatar = "https://xucre-public.s3.sa-east-1.amazonaws.com/whatsapp.png";
    return (
        <ScrollView horizontal={false}>
            <ScrollView
                horizontal={true}
            >
                <Box backgroundColor={colorMode === 'dark' ? '#1b1e24' : '#fff'} flex={1}>

                    <VStack w="100%" space={5} alignSelf="center">
                        <Input placeholder="Search" variant="filled" marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                            onChangeText={(text) => { console.log(text) /*searchItem(text)*/ }} onFocus={(event) => { /*eventFocus(event)*/ }} />
                    </VStack>
                    <FlatList
                        data={contactList}
                        horizontal={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        const amount = route.params.param1
                                        const walletA = route.params.param2
                                        const token = route.params.param3
                                        const rqs = route.params.param4
                                        openPage("CodeCountry", item, walletA,amount,rqs,token);
                                        //<CodeCountry navigation={navigation} route={item}/>
                                        /*  const walletA = _wallet.wallet.address
                                      whatsapp(item, 'shareqrcode', 'en_US', {param1: 'www.google.com', param2: walletA}, translations[language].QRWallet.toast_send); */
                                    }}
                                >
                                    <Box alignItems={'center'} flexDirection={'row'}>
                                        <Image
                                            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1177/1177568.png"}}
                                            height={40}
                                            ml={15}
                                            width={40}
                                            alt="logo"
                                        />
                                        <Box p={10}>
                                            <Text
                                                color={colorMode === "dark" ? Color.white : Color.black}
                                            >
                                                {item.displayName}
                                            </Text>
                                            <Text
                                                mt={4}
                                                color={colorMode === "dark" ? Color.white : Color.black}
                                            >
                                                {item.phoneNumbers[0].number}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box pr={15} flexDirection={'row'}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log('touched');
                                                /*const url = Communications.text(
                                                    item.phoneNumbers[0].number
                                                );*/
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: avatar,
                                                }}
                                                height={40}
                                                mr={20}
                                                width={40}
                                                alt="logo"
                                            />
                                        </TouchableOpacity>
                                        
                                    </Box>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </Box>
            </ScrollView>
        </ScrollView>
    );
}
