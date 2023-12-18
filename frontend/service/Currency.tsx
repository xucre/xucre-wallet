import React, { useEffect, useState } from "react";
import { Color } from "../../GlobalStyles";
import GuestLayout from '../layouts/GuestLayout';
import translations from "../assets/translations";

import {
    Avatar,
    Box,
    HStack,
    Pressable,
    ScrollView,
    Text,
    useColorMode,
    VStack,
} from "native-base";
import { useRecoilState } from "recoil";
import {
    activeNetwork,
    networkList,
    selectedNetwork,
    language as stateLanguage,
} from "./state";


export default function Currency({ navigation, route }: {navigation: {navigate: Function}, route: any}) {
    const [language,] = useRecoilState(stateLanguage);
    let currency: string[] = ['USD','ARS','BOB','BRL','CLP','COP','GTQ','MXN','PAB','PEN']

    const { colorMode } = useColorMode();

    const viewSelectWallet = () => {
        navigation.navigate('SelectWallet');
    }


    const CurrencyItem = ({ metadata }: {metadata : any}) => {
        const selectNetwork = () => {
            
        }
    
        const openSelectNetwork = () => {
            
        }
    

        return (
            <HStack alignItems="center" justifyContent="space-between" pr={3} py={1} borderRadius={25} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
                <Pressable onPress={() => { openSelectNetwork() }}>
                    <HStack alignItems="center" space={{ base: 3, md: 6 }}>
                        <Text fontSize="md" bold>
                            {metadata}
                        </Text>
                    </HStack>
                </Pressable>
            </HStack>
        )
    }
    
    
    return (
        <GuestLayout >

            <ScrollView height={'full'}>
                <Box
                    _light={{ backgroundColor: Color.white }}
                    _dark={{ backgroundColor: Color.black }}

                    width={'100%'}
                >
                    <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={'md'} fontWeight={'bold'}>{translations[language as keyof typeof translations].SelectNetwork.title}</Text>
                    <Text style={{ color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={15} >{translations[language as keyof typeof translations].SelectNetwork.select_network_default}</Text>

                    <VStack space={3} py={4}>
                        {
                            currency.map((val, i) => {
                                return (
                                    <Box key={val + i} px={4} py={0} >
                                        <CurrencyItem metadata={val} />
                                    </Box>
                                )
                            })
                        }
                    </VStack>
                </Box>
            </ScrollView>
        </GuestLayout>
    )

}