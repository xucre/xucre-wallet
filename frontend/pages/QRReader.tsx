import { parseUri } from '@walletconnect/utils'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';
import { Box, Center, Text, useToast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';

import translations from "../assets/translations";
import { language as stateLanguage } from "../service/state";
import { createSignClient, signClient } from '../service/walletConnect';

export default function QRReader({ navigation }: { navigation: { navigate: Function } }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { show } = useToast();
  const [language,] = useRecoilState(stateLanguage);

  useEffect(() => {
    let isMounted = true;
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (isMounted) setHasPermission(status === PermissionStatus.GRANTED);
    };
    setScanned(false);
    getBarCodeScannerPermissions();
    return () => { isMounted = false }
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: any, data: string }) => {
    setScanned(true);
    const { version, relay } = parseUri(data);
    try {
      if (data && relay) {
        signClient.pair({ uri: data });
      }

    } catch (e) {
      show({ title: translations[language as keyof typeof translations].QRReader.error, description: JSON.stringify(e), duration: 9000 })
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
      <Center><Text colorScheme={'primary'}>QR</Text></Center>
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