import {
  AlertDialog,
  Button,
  Center,
  IconButton,
  ScrollView,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
import QRCode from "react-qr-code";

export default function QRButton({ address }: { address: string }) {
  const [language,] = useRecoilState(stateLanguage);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  //{translations[language].BasePage.title}

  return (
    <>
      <IconButton onPress={() => setIsOpen(!isOpen)} colorScheme={'dark'} key={'copyButton'} variant={'ghost'} _icon={{
        as: MaterialIcons,
        name: "qr-code"
      }} />
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} size={'full'}>
        <AlertDialog.Content>
          {/*<AlertDialog.CloseButton />
          <AlertDialog.Header>{translations[language as keyof typeof translations]?.QRWallet.instructions}</AlertDialog.Header>*/}
          <AlertDialog.Body>
            <Center >
              <Text marginY={8}>{translations[language as keyof typeof translations]?.QRWallet.instructions}</Text>
              <QRCode
                size={350}
                style={{ height: "auto", marginLeft: 'auto', marginRight: 'auto', maxWidth: "100%", width: "100%" }}
                value={address}
                viewBox={`0 0 200 200`}
              />
              <Text marginY={4}></Text>
            </Center>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Center>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                  Close
                </Button>
              </Button.Group>
            </Center>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}

/*



      */