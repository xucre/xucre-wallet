/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable import/order */
import { useIsFocused } from '@react-navigation/native';
import {
    Box,
    Icon,
    Image,
    Input,
    ScrollView,
    Text,
    useColorMode,
    VStack,
} from "native-base";
import { Color } from '../../../GlobalStyles';
import { language as stateLanguage } from "../../service/state";
import { useRecoilState } from "recoil";
import {
    NativeSyntheticEvent,
    PermissionsAndroid,
    TextInputFocusEventData,
    TouchableOpacity,
    View,
} from "react-native";
import Contact from "react-native-contacts";
import { Key, ReactNode, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DashboardLayout from '../../layouts/DashboardLayout';

type ContactType = {
    givenName: any;
    recordID: Key | null | undefined;
    displayName: ReactNode;
    phoneNumbers: any;

}

export default function SendNotificationToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

    const { colorMode } = useColorMode();
    const [language] = useRecoilState(stateLanguage);
    const [contactList, setContactList] = useState([] as ContactType[]);
    const isFocused = useIsFocused();
    useEffect(() => {
        let isMounted = true;
        const runAsync = async () => {
            const _contactList = await getPermission(false);
            if (isMounted) setContactList(_contactList);
        }
        if (isFocused) {
            runAsync();
        }
        return () => { isMounted = false };
    }, [isFocused]);

    const getPermission = async (save: boolean) => {
        const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: "Contacts",
            // eslint-disable-next-line sort-keys
            message: "This app would like to view your contacts.",
            // eslint-disable-next-line sort-keys
            buttonPositive: "Please accept bare mortal",
        })
        if (res == "granted") {
            const con = await Contact.getAll();
            const filteredContacts = con.filter(
                (item) => item.phoneNumbers.length
            );
            filteredContacts.sort((a, b) => a.displayName > b.displayName ? 1 : -1);
            if (save) setContactList(filteredContacts);
            return filteredContacts;
        } return [];
    };

    const openPage = (pageName: string, param1: any, param2: any, param3: any, param4: any, param5: any) => {
        switch (pageName) {
            case 'CodeCountry':
                navigation.navigate('CodeCountry', { param1, param2, param3, param4, param5 });
                break;
        }
    }

    const searchItem = (textSearch: string) => {
        const data = contactList;
        if (textSearch) {
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

    const eventFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        const eventFocus = event;
    }


    const avatar = "https://xucre-public.s3.sa-east-1.amazonaws.com/whatsapp.png";
    return (
        <ScrollView horizontal={false} style={{ flex: 1 }}>
            <ScrollView
                horizontal={true}
                contentContainerStyle={{
                    height: '100%',
                    width: '100%',
                }}>
                <DashboardLayout title={''}>
                    <Box
                        _light={{ backgroundColor: Color.white }}
                        _dark={{ backgroundColor: Color.black }}
                        height={'100%'}
                        safeAreaBottom
                    >
                        <View style={{ backgroundColor: colorMode === 'dark' ? Color.black : Color.white, flex: 1 }}>

                            <VStack w="100%" space={5} alignSelf="center">
                                <Input placeholder="Search" variant="filled" marginLeft="5" marginTop="5" width="90%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                                    onChangeText={(text) => { searchItem(text) }} onFocus={(event) => { eventFocus(event) }} />
                            </VStack>



                            <ScrollView>
                                {contactList.map((contactList) => (
                                    <><TouchableOpacity style={{
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
                                    >
                                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>

                                            <Image
                                                source={{
                                                    uri: 'https://cdn-icons-png.flaticon.com/512/1177/1177568.png',
                                                }}
                                                style={{ height: 40, marginLeft: 15, width: 40 }}
                                                alt="logo"
                                            />
                                            <View style={{ padding: 10 }}>
                                                <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black }} key={contactList.recordID}>{contactList.displayName}</Text>
                                                <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, marginTop: 4 }} >
                                                    {contactList.phoneNumbers[0].number}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const amount = route.params.param1
                                                const walletA = route.params.param2
                                                const token = route.params.param3
                                                const rqs = route.params.param4
                                                openPage("CodeCountry", contactList, walletA, amount, rqs, token);

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

                                    </>

                                ))}
                            </ScrollView>




                        </View>
                    </Box>
                </DashboardLayout>
            </ScrollView>
        </ScrollView>
    )
}
