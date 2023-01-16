import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
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
  MoonIcon,
  Pressable,
  ScrollView,
  Stack,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { getLastUnlock, hasPassword, storePassword, validatePassword } from "../store/setting";

export default function SetPassword({navigation, route}) {
  const [existingPassword, setExistingPassword] = useState(false);
  const [inputPw, setInputPw] = useState('');
  const handleChangeInputPw = text => setInputPw(text);
  const [confirmPw, setConfirmPw] = useState('');
  const handleChangeConfirmPw = text => setConfirmPw(text);
  const [currentPw, setCurrentPw] = useState('');
  const handleChangeCurrentPw = text => setCurrentPw(text);
  const [isValid, setIsValid] = useState(false);
  const [pwMatch, setPwMatch] = useState(false);

  const [language, ] = useRecoilState(stateLanguage);

  useEffect(() => {
    const runAsync = async () => {
      const _existingPassword = await hasPassword();
      setExistingPassword(_existingPassword);
    }

    runAsync();
  }, []);

  useEffect(() => {
    const runAsync = async () => {
      const _isValid = await validatePassword(currentPw);
      setIsValid(_isValid);
    }
    if (currentPw.length > 0) {
      runAsync();
    }
  }, [currentPw]);

  useEffect(() => {
    if (inputPw.length > 0) {
      setPwMatch(inputPw === confirmPw);
    }
  }, [inputPw, confirmPw])

  const save = async () => {
    const result = await storePassword(currentPw, inputPw);
    if (result.message === 'success') {
      navigation.navigate('Home');
    }
  }
  
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>
      <Box w="100%">
        <FormControl>
          {existingPassword && 
            <>
              <Stack mx="4" my={4}>
                <FormControl.Label><Text>{translations[language].SetPassword.form_old_header}</Text></FormControl.Label>
                <Input value={currentPw} onChangeText={handleChangeCurrentPw} shadow={2} type="password" placeholder={translations[language].SetPassword.password_placeholder} />
              </Stack>
            </>
          }
          <Stack mx="4" my={4}>
            <FormControl.Label><Text>{translations[language].SetPassword.form_new_header}</Text></FormControl.Label>
            <Input value={inputPw} onChangeText={handleChangeInputPw} shadow={2} type="password" placeholder={translations[language].SetPassword.password_placeholder} />
            <FormControl.HelperText>
              <Text>{translations[language].SetPassword.form_helper_text}</Text>
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            <Text>{translations[language].SetPassword.form_error_text}</Text>
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4" my={4}>
          <FormControl.Label><Text>{translations[language].SetPassword.form_confirmation}</Text></FormControl.Label>
            <Input value={confirmPw} onChangeText={handleChangeConfirmPw} shadow={2} type="password" placeholder={translations[language].SetPassword.password_placeholder} />
          </Stack>
          <Button mx="4" my={4} onPress={() => {save()}} isDisabled={(existingPassword && !isValid && !pwMatch) || (!existingPassword && !pwMatch)}>{translations[language].SetPassword.form_save_button}</Button>
        </FormControl>
      </Box>
    </ScrollView>
  );
}