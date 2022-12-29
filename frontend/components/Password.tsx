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
import { getLastUnlock, validatePassword } from "../store/setting";
import ErrorToast from "./ErrorToast";

export default function PasswordPage({navigation, route, validateAuth}) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    //console.log(event.nativeEvent.text);
    setPassword(event.nativeEvent.text);
  }

  const savePassword = async () => {
    const _isValid = await validatePassword(password);
    if (_isValid) {
      validateAuth();
    } else {
      setErrorMessage('Invalid Password');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>
  
      <Modal isOpen={true} onClose={() => console.log('attemptedClose')} avoidKeyboard justifyContent="flex-end" bottom="4" size="lg">
        <Modal.Content>
          <Modal.Header>Password</Modal.Header>
          <Modal.Body>
          
            <FormControl mt="3">
              <FormControl.Label>Password</FormControl.Label>
              {
                //translations[language].CreateWallet.name_entry_input_placeholder
              }
              <Input w="100%" value={password} onChange={handleChange} placeholder={'Input password'}  />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={() => {
            savePassword();
          }}>
              Submit
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