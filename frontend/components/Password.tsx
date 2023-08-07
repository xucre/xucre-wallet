import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import moment from "moment";
import {
  AlertDialog,
  ArrowBackIcon,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  FormControl,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { getLastUnlock, validatePassword } from "../store/setting";

import ErrorToast from "./utils/ErrorToast";

export default function PasswordPage({navigation, route, validateAuth}) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [language, ] = useRecoilState(stateLanguage);

  const handleChange = (event) => {
    //console.log(event.nativeEvent.text);
    setPassword(event.nativeEvent.text);
  }

  const savePassword = async () => {
    const _isValid = await validatePassword(password);
    if (_isValid) {
      validateAuth();
    } else {
      setErrorMessage(translations[language].PasswordComponent.error_message);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>
  
      <Modal isOpen={true} onClose={() => console.log('attemptedClose')} avoidKeyboard justifyContent="flex-end" bottom="4" size="lg">
        <Modal.Content>
          <Modal.Header>{translations[language].PasswordComponent.header}</Modal.Header>
          <Modal.Body>
          
            <FormControl mt="3">
              <FormControl.Label>{translations[language].PasswordComponent.form_label}</FormControl.Label>
              <Input w="100%" value={password} onChange={handleChange} placeholder={translations[language].PasswordComponent.form_placeholder}  />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={() => {
            savePassword();
          }}>
              {translations[language].PasswordComponent.submit_button}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {errorMessage.length > 0 && 
        <ErrorToast errorMessage={errorMessage} />
      }
    </ScrollView>
  );
}

export const needsAuth = async () => {
  const unlockDate = await getLastUnlock();
  if (unlockDate) {
    const _unlockDate = moment(unlockDate);
    const now = moment();
    if (now.diff(_unlockDate, 'hours', true) > 2) {
      return true;
    } 
  } 
    
  return false;
  
}