import moment from "moment";
import {
  Button,
  FormControl,
  Input,
  Modal,
  ScrollView,
} from "native-base";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { getLastUnlock, validatePassword } from "../store/setting";

import ErrorToast from "./utils/ErrorToast";

export default function PasswordPage({ navigation, route, validateAuth }: { navigation: { navigate: Function }, route: any, validateAuth: Function }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [language,] = useRecoilState(stateLanguage);

  const handleChange = (event: { nativeEvent: { text: React.SetStateAction<string>; }; }) => {
    setPassword(event.nativeEvent.text);
  }

  const savePassword = async () => {
    const _isValid = await validatePassword(password);
    if (_isValid) {
      validateAuth();
    } else {
      setErrorMessage(translations[language as keyof typeof translations].PasswordComponent.error_message);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }
  return (
    <ScrollView w={'full'} h={'full'} marginTop={5}>

      <Modal isOpen={true} onClose={() => null} avoidKeyboard justifyContent="flex-end" bottom="4" size="lg">
        <Modal.Content>
          <Modal.Header>{translations[language as keyof typeof translations].PasswordComponent.header}</Modal.Header>
          <Modal.Body>

            <FormControl mt="3">
              <FormControl.Label>{translations[language as keyof typeof translations].PasswordComponent.form_label}</FormControl.Label>
              <Input w="100%" value={password} onChange={handleChange} placeholder={translations[language as keyof typeof translations].PasswordComponent.form_placeholder} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={() => {
              savePassword();
            }}>
              {translations[language as keyof typeof translations].PasswordComponent.submit_button}
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
  // if (unlockDate) {
  //   const _unlockDate = moment(unlockDate);
  //   const now = moment();
  //   if (now.diff(_unlockDate, 'hours', true) > 2) {
  //     //return true;
  //   }
  // }
  // TODO - Implement Screen Locking if Auth is False
  return false;

}