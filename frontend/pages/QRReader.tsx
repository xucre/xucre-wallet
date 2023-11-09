import { parseUri } from '@walletconnect/utils'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';
import { Box, Center, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet,  View } from 'react-native';
import { useRecoilState } from 'recoil';

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { createSignClient, signClient } from '../service/walletConnect';

export default function QRReader({navigation}: {navigation: {navigate: Function}}) {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [language, ] = useRecoilState(stateLanguage);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    };
    setScanned(false);
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data } : {type: any, data: string}) => {
    setScanned(true);
    const { version, relay } = parseUri(data);
    try {
      signClient.pair({uri: data});
    } catch (e) {
      //
    }
  };

  if (hasPermission === null) {
    return <Center><Text colorScheme={'primary'}>{translations[language as keyof typeof translations].QRReader.permission_request}</Text></Center>;
  }
  if (hasPermission === false) {
    return <Center><Text colorScheme={'primary'}>{translations[language as keyof typeof translations].QRReader.permission_denied}</Text></Center>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={translations[language as keyof typeof translations].QRReader.rescan} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});