/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import {
  Button,
  Center,
  Text,
  useColorMode,
} from "native-base";
import React, {} from "react";
import {StyleSheet} from 'react-native';
import { useRecoilState } from "recoil";

import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import translations from "../../assets/translations";
import { language as stateLanguage } from "../../service/state";


export default function NewWallet ({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const { colorMode } = useColorMode();

  const [language,] = useRecoilState(stateLanguage);
  
  const createWallet = () => {
    navigation.navigate('CreateWallet');
  }

  const recoverWallet = () => {
  navigation.navigate('RecoverWallet');
}

  return (
    
    <Center alignItems="center" marginBottom={20} h={'3/4'} w ={'full'}>
    
          <Text  style={[
            colorMode === 'dark' ? styles.yourWallet : lightStyles.yourWallet, 
            colorMode === 'dark' ? styles.walletTypo : lightStyles.walletTypo,
          ]} fontSize={'lg'} mt={10}>{translations[language as keyof typeof translations].NewWallet.instructions}</Text>
          <Text style={[
            colorMode === 'dark' ? styles.createANew : lightStyles.createANew,
            colorMode === 'dark' ? styles.createFlexBox : lightStyles.createFlexBox,
          ]} fontSize={'md'} py={5} px={5}>{translations[language as keyof typeof translations].NewWallet.about}</Text>
     
            <Button style={[
              colorMode === 'dark' ? styles.rectangleParent : lightStyles.rectangleParent,
              colorMode === 'dark' ? styles.rectangleLayout : lightStyles.rectangleLayout,
            ]} my={3} w={'90%'} onPress={createWallet} py={3}><Text style={{color: colorMode === 'dark' ? 'black' : 'black', fontWeight: 'bold'}}>{translations[language as keyof typeof translations].NewWallet.create_button}</Text></Button>
        
            <Button style={[
              colorMode === 'dark' ? styles.rectangleGroup : lightStyles.rectangleGroup,
              colorMode === 'dark' ? styles.rectangleLayout : lightStyles.rectangleLayout,
              colorMode === 'dark' ? styles.buttonBorder : lightStyles.buttonBorder,
            ]} width={'90%'} py={3} colorScheme="primary" onPress={recoverWallet} >
              <Text color={colorMode === 'dark' ? 'white' : 'white'} textAlign={'center'}>{translations[language as keyof typeof translations].NewWallet.recover_button}</Text>
            </Button>
  
              
      </Center>
  )
}

const styles = StyleSheet.create({
  buttonBorder:{
    borderColor: "#fff",
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
  },
  createANew: {
    color: Color.darkgray_100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
    textAlign: "center",
  },
  createFlexBox: {
    letterSpacing: -0.2,
    textAlign: "center",
  },
  rectangleGroup: {
    backgroundColor: Color.gray_300,
    borderColor: '#fff',
    borderRadius: 100,
  },
  rectangleLayout: {
    borderColor: '#fff',
    height: 60,
    borderRadius: 100,
  },
  rectangleParent: {
    backgroundColor: '#D4E815',
    borderRadius: 100,
    fontFamily: FontFamily.inter,
  },
  walletTypo: {
    color: Color.white,
    fontFamily: FontFamily.inter,
    fontWeight: "600",
  },
  yourWallet: {
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  }

})

const lightStyles = StyleSheet.create({
  buttonBorder:{
    borderColor: "#000",
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
  },
  createANew: {
    color: Color.darkgray_100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.size_base,
    letterSpacing: -0.2,
    lineHeight: 21,
    textAlign: "center",
  },
  createFlexBox: {
    letterSpacing: -0.2,
    textAlign: "center",
  },
  rectangleGroup: {
    backgroundColor: Color.gray_300,
    borderColor: '#fff',
    borderRadius: 100,
  },
  rectangleLayout: {
    borderColor: '#fff',
    borderRadius: 100,
    height: 60,
  },
  rectangleParent: {
    backgroundColor: '#D4E815',
    borderRadius: 100,
    fontFamily: FontFamily.inter,
  },
  walletTypo: {
    color: Color.black,
    fontFamily: FontFamily.inter,
    fontWeight: "600",
  },
  yourWallet: {
    color: 'black',
    fontSize: FontSize.size_3xl,
    letterSpacing: -0.3,
    lineHeight: 36,
    textAlign: "center",
  }

})