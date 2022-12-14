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
import { getLastUnlock, hasPassword, validatePassword, storePassword } from "../store/setting";

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
                <FormControl.Label><Text>Current Password</Text></FormControl.Label>
                <Input value={currentPw} onChangeText={handleChangeCurrentPw} shadow={2} type="password" placeholder="password" />
              </Stack>
            </>
          }
          <Stack mx="4" my={4}>
            <FormControl.Label><Text>Password</Text></FormControl.Label>
            <Input value={inputPw} onChangeText={handleChangeInputPw} shadow={2} type="password" placeholder="password" />
            <FormControl.HelperText>
              <Text>Must be atleast 6 characters.</Text>
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            <Text>At least 6 characters are required.</Text>
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4" my={4}>
          <FormControl.Label><Text>Confirm Password</Text></FormControl.Label>
            <Input value={confirmPw} onChangeText={handleChangeConfirmPw} shadow={2} type="password" placeholder="password" />
          </Stack>
          <Button mx="4" my={4} onPress={() => {save()}} isDisabled={(existingPassword && !isValid && !pwMatch) || (!existingPassword && !pwMatch)}>Save</Button>
        </FormControl>
      </Box>
    </ScrollView>
  );
}