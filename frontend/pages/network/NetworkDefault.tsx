/* eslint-disable sort-keys */
/* eslint-disable import/order */
/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, { createRef, useEffect, useState } from "react";
import { position } from "native-base/lib/typescript/theme/styled-system";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";

import arrayShuffle from 'array-shuffle';
import { ethers } from 'ethers';
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
    Divider,
    Drawer,
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
    SunIcon,
    Text,
    Tooltip,
    useColorMode,
    useColorModeValue,
    View,
    VStack,
} from "native-base";
import { StyleSheet } from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";
import { getIconImage } from "../../service/api";
import translations from "../../assets/translations";
import GuestLayout from '../../layouts/GuestLayout';
import {
    activeNetwork,
    networkList,
    selectedNetwork,
    language as stateLanguage,
} from "../../service/state";
import { truncateString } from "../../service/utility";
import { deleteNetwork, getNetworks, storeActiveNetwork } from "../../store/network";

export default function NetworkDefault({ navigation, route }) {
    const [language,] = useRecoilState(stateLanguage);
    const { colorMode } = useColorMode();
    const [, setSelectedNetwork] = useRecoilState(selectedNetwork);
    const [networks, setNetworks] = useRecoilState(networkList);
    const [, setActiveNetwork] = useRecoilState(activeNetwork);
    const [tokenImage, setTokenImage] = useState('');
    useEffect(() => {
        const runAsync = async () => {
            const _networks = await getNetworks();
            if (Array.isArray(_networks)) {
                setNetworks(_networks);
            }
        }
        runAsync();
    }, [tokenImage])

    const viewSelectWallet = () => {
        navigation.navigate('SelectWallet');
    }

    const getIconNetwork = async (metadata: any) => {
        try {
            if (metadata && metadata.symbol) {
                const img = await getIconImage(metadata.symbol.toLowerCase());
                return img
            }

        } catch (err) {
            //
        }

    }

    const NetworkItem = ({ metadata }) => {
        const selectNetwork = () => {
            setActiveNetwork(metadata);
            storeActiveNetwork(metadata);
            //viewSelectWallet();
        }

        const openSelectNetwork = () => {
            setSelectedNetwork(metadata);
            setActiveNetwork(metadata);
            storeActiveNetwork(metadata);
            viewSelectWallet();
        }

        const [avatar, setAvatar] = useState('');
        useEffect(() => {
            if (metadata && metadata.symbol) {
                setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + metadata.symbol.toLowerCase() + '.png');
            } else {
                setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png');
            }
        }, [metadata])

        return (
            <HStack alignItems="center" justifyContent="space-between" pr={3} py={1} borderRadius={25} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
                <Pressable onPress={() => { openSelectNetwork() }}>
                    <HStack alignItems="center" space={{ base: 3, md: 6 }}>
                        <Avatar bg={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.300'} size="md" ml="10px" mb="10px" mr="1" mt="4px" source={{
                            uri: avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
                        }} />
                        <Text fontSize="md" bold>
                            {metadata.name}
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
                    <Text style={{ color: colorMode === 'dark' ? Color.white : Color.black, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={'md'} fontWeight={'bold'}>{translations[language].SelectNetwork.title}</Text>
                    <Text style={{ color: Color.gray_100, textAlign: 'center', marginLeft: 15, marginRight: 15 }} fontSize={15} >{translations[language].SelectNetwork.select_network_default}</Text>

                    <VStack space={3} py={4}>
                        {
                            networks.map((val, i) => {
                                return (
                                    <Box key={val.name + i} px={4} py={0} >
                                        <NetworkItem metadata={val} />
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
