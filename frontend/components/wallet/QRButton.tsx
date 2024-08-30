import {
  AlertDialog,
  Button,
  Center,
  IconButton,
  Menu,
  Pressable,
  ScrollView,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { language as stateLanguage } from "../../service/state";
import translations from "../../assets/translations";
// import QRCode from "react-qr-code";
import QRCode from 'react-native-qrcode-svg';
import base64Logo from '../../assets/images/icon-green.png'
import { env } from "../../service/constants";
import { Chain } from "../../types/token";

export default function QRButton({ address, btcAddress }: { address: string, btcAddress: string }) {
  const [language,] = useRecoilState(stateLanguage);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const [selectedChain, setSelectedChain] = React.useState<Chain>(Chain.ETHEREUM);
  //{translations[language].BasePage.title}
  const handleSelect = (chain: Chain) => {
    setSelectedChain(chain);
    setIsOpen(!isOpen);
  }

  const ethUrl = address && address.length > 0 ? `${Chain.ETHEREUM}:${address}` : '';
  const btcUrl = btcAddress && btcAddress.length > 0 ? `${Chain.BITCOIN}:${btcAddress}` : '';
  const url = selectedChain === Chain.ETHEREUM ? ethUrl : btcUrl;
  return (
    <>
      {address && address.length > 0 &&
        <>

          <Menu w="190" trigger={triggerProps => {
            return <IconButton {...triggerProps} colorScheme={'dark'} key={'copyButton'} variant={'ghost'} _icon={{
              as: MaterialIcons,
              name: "qr-code"
            }} />
          }}>
            <Menu.Item onPress={() => handleSelect(Chain.ETHEREUM)}>{Chain.ETHEREUM}</Menu.Item>
            <Menu.Item onPress={() => handleSelect(Chain.BITCOIN)}>{Chain.BITCOIN}</Menu.Item>
          </Menu>
          <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} size={'full'}>
            <AlertDialog.Content>
              {/*<AlertDialog.CloseButton />
            <AlertDialog.Header>{translations[language as keyof typeof translations]?.QRWallet.instructions}</AlertDialog.Header>*/}
              <AlertDialog.Body>
                <Center >
                  <Text marginY={8}>{translations[language as keyof typeof translations]?.QRWallet.instructions}</Text>
                  <QRCode
                    size={350}
                    value={url}
                    //viewBox={`0 0 200 200`}
                    //logo={{ uri: base64Logo }}
                    logo={base64Logo}
                    logoSize={85}
                    logoBackgroundColor={'white'}
                    logoMargin={2}
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
      }

      {!address &&
        <Text>{translations[language as keyof typeof translations].ui.address_not_found}</Text>
      }

    </>
  );
}