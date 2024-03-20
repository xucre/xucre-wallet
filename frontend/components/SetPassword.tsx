import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  ScrollView,
  Stack,
  Text,
  WarningOutlineIcon,
  useColorMode,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { hasPassword, storePassword, validatePassword } from "../store/setting";
import { Color } from "../../GlobalStyles";
import { MaterialIcons } from '@expo/vector-icons';

export default function SetPassword({ setIsExisting }: { setIsExisting: Function }) {
  const [existingPassword, setExistingPassword] = useState(false);
  const { colorMode } = useColorMode();
  const [inputPw, setInputPw] = useState('');
  const handleChangeInputPw = (text: React.SetStateAction<string>) => setInputPw(text);
  const [confirmPw, setConfirmPw] = useState('');
  const handleChangeConfirmPw = (text: React.SetStateAction<string>) => setConfirmPw(text);
  const [currentPw, setCurrentPw] = useState('');
  const handleChangeCurrentPw = (text: React.SetStateAction<string>) => setCurrentPw(text);
  const [isValid, setIsValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pwMatch, setPwMatch] = useState(false);

  const [language,] = useRecoilState(stateLanguage);

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
      //navigation.navigate('Home');
      setExistingPassword(true)
      setIsOpen(false);
    }
  }

  useEffect(() => {
    setIsExisting(existingPassword)
  }, [existingPassword])

  const shouldBeOpen = (existingPassword && isOpen) || !existingPassword;
  return (
    <Box w={'full'}>
      {shouldBeOpen &&
        <FormControl>
          {existingPassword &&
            <>
              <Stack mx="4" my={4}>
                <FormControl.Label><Text>{translations[language as keyof typeof translations].SetPassword.form_old_header}</Text></FormControl.Label>
                <Input value={currentPw} onChangeText={handleChangeCurrentPw} shadow={2} type="password" placeholder={translations[language as keyof typeof translations].SetPassword.password_placeholder} />
              </Stack>
            </>
          }
          <Stack mx="4" my={4}>
            <FormControl.Label><Text>{translations[language as keyof typeof translations].SetPassword.form_new_header}</Text></FormControl.Label>
            <Input value={inputPw} onChangeText={handleChangeInputPw} shadow={2} type="password" placeholder={translations[language as keyof typeof translations].SetPassword.password_placeholder} />
            <FormControl.HelperText>
              <Text>{translations[language as keyof typeof translations].SetPassword.form_helper_text}</Text>
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              <Text>{translations[language as keyof typeof translations].SetPassword.form_error_text}</Text>
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4" my={4}>
            <FormControl.Label><Text>{translations[language as keyof typeof translations].SetPassword.form_confirmation}</Text></FormControl.Label>
            <Input value={confirmPw} onChangeText={handleChangeConfirmPw} shadow={2} type="password" placeholder={translations[language as keyof typeof translations].SetPassword.password_placeholder} />
          </Stack>
          <Button
            mx="4"
            my={4}
            variant={'solid'}
            colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            onPress={() => { save() }}
            isDisabled={(existingPassword && !isValid && !pwMatch) || (!existingPassword && !pwMatch)}
          >
            <Text color={colorMode === 'dark' ? Color.black : Color.white} bold> {translations[language as keyof typeof translations].SetPassword.form_save_button}</Text>
          </Button>
        </FormControl>
      }

      {!shouldBeOpen &&
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Box></Box>
          <IconButton
            variant={'outline'}
            colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
            _icon={{
              as: MaterialIcons,
              name: "lock"
            }}
            onPress={() => { setIsOpen(true); setIsExisting(false); }}
          />
          {/*<Button w={'full'} mx="4" my={4} onPress={() => { setIsOpen(true); setIsExisting(false); }} variant={'solid'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} ><Text color={colorMode === 'dark' ? Color.black : Color.white} bold>{translations[language as keyof typeof translations].SetPassword.update_button}</Text></Button>*/}
        </Stack>
      }
    </Box>
  );
}