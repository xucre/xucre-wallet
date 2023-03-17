//import LIFI, {ChainId} from '@lifi/sdk';
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { Box, Input, Text, View } from 'native-base';
import {Button} from 'native-base'
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';

import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";




export default function SuportPage({ navigation, route }) {


    return (
        <View style={styles.support}>
            <Text style={styles.support1}>Support</Text>

            <Text style={[styles.ifYouHaveContainer, styles.contactUsViaTypo]}>
                <Text
                    style={styles.ifYouHave}
                >{`If you have problems with our app please contact us at `}</Text>
                <Text style={styles.supportxsucrecom}>support@xsucre.com</Text>
                <Text style={styles.ifYouHave}> or use the form below</Text>
            </Text>
            <View style={[styles.input, styles.inputPosition]}>
                <Text style={styles.email}>Email</Text>
                <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                    <Input style={styles.textoImput} placeholderTextColor={'white'} w="105%" mb={2} placeholder="your@email.com" />
                </View>
            </View>

            <View style={[styles.input1, styles.inputPosition]}>
                <Text style={styles.email}>Describe your issue</Text>
                <View style={[styles.rectangleGroup, styles.groupLayout]}>
                    <Input style={styles.textoImputArea} placeholderTextColor={'white'} w="105%" mb={2} placeholder="Suggestions and / or report problems" />
                </View>
            </View>

            <Button style= {styles.buttonContainer}><Text color={'#000'}>Send Email</Text></Button>
       
        </View>
      
    )
}


const styles = StyleSheet.create({
    rectangleParent1: {
        top: 330,
        borderRadius: Border.br_sm,
        backgroundColor: '#D4E815',
        fontFamily: FontFamily.interSemibold,
      },
    rectangleLayout: {
        height: 60,
        width: 330,
        left: 33,
        position: "absolute",
        borderColor: '#fff',
      },
    support: {
        backgroundColor: Color.black,
        borderColor: "#000",
        flex: 1,
        width: "100%",
        height: 844,
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid",
        textAlign: "center",
    },
    support1: {
        top: 39,
        fontSize: FontSize.size_2xl,
        lineHeight: 30,
        textAlign: "left",
        fontFamily: FontFamily.interSemibold,
        fontWeight: "600",
        letterSpacing: -0.2,
        color: Color.white,
        left: 19,
        position: "absolute",
    },
    ifYouHaveContainer: {
        top: 121,
    },
    contactUsViaTypo: {
        width: 330,
        fontFamily: FontFamily.interRegular,
        left: 20,
        lineHeight: 21,
        fontSize: FontSize.size_base,
        textAlign: "left",
        letterSpacing: -0.2,
        position: "absolute",
    },
    ifYouHave: {
        color: Color.darkgray_100,
    },
    supportxsucrecom: {
        color: Color.white,
    },
    input: {
        top: 192,
        height: 74,
    },
    inputPosition: {
        width: 351,
        left: 20,
        position: "absolute",
    },
    rectangleParent: {
        top: 27,
    },
    groupItemLayout: {
        height: 47,
        width: 351,
        left: 0,
        position: "absolute",
    },
    groupBorder: {
        borderColor: "#7b7b7b",
        backgroundColor: Color.gray_300,
        borderRadius: Border.br_xs,
        top: 0,
        borderWidth: 1,
        borderStyle: "solid",
    },
    groupItemLayout: {
        height: 47,
        width: 351,
        left: 0,
        position: "absolute",
    },
    youremailcom: {
        top: 12,
        left: 19,
        width: 311,
        color: Color.dimgray,
        position: "absolute",
    },
    youremailcomTypo: {
        width: 311,
        color: Color.dimgray,
        fontFamily: FontFamily.interRegular,
        lineHeight: 21,
        fontSize: FontSize.size_base,
        textAlign: "left",
        letterSpacing: -0.2,
    },
    textoImput: {
        borderRadius: Border.br_xs,
        backgroundColor: Color.gray_300,
        borderColor: "#7b7b7b",
        borderWidth: 1,
        borderStyle: "solid",
        width: 380,
        top: 0,
    }, 
    textoImputArea:{
        borderRadius: Border.br_xs,
        backgroundColor: Color.gray_300,
        borderColor: "#7b7b7b",
        borderWidth: 1,
        borderStyle: "solid",
        width: 339,
        top: 0,
        height: 190,
    },

    input1: {
        top: 284,
        height: 217,
      },
      rectangleGroup: {
        top: 27,
      },
      groupLayout: {
        height: 190,
        width: 351,
        left: 0,
        position: "absolute",
      },
      groupBorder: {
        borderColor: "#7b7b7b",
        backgroundColor: Color.gray_300,
        borderRadius: Border.br_xs,
        top: 0,
        borderWidth: 1,
        borderStyle: "solid",
      },
      buttonContainer: {
        fontWeight: 'bold',
        // eslint-disable-next-line sort-keys
        backgroundColor: '#D4E815',
        position: 'relative',
        width: 370,
        top: 580,
        left: 20,
        textAlign: "left",
        borderRadius: Border.br_sm,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: '#fff',
    
      },
});