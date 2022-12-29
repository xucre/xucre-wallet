import { parseUri } from '@walletconnect/utils'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Box, Center, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet,  View } from 'react-native';

import { createSignClient, signClient } from '../service/walletConnect';
import { createLegacySignClient } from '../service/walletConnectLegacy';

export default function QRReader({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    setScanned(false);
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const { version, relay } = parseUri(data);
    //console.log(type, data, version, relay);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    try {
      if (version === 1) {
        createLegacySignClient({uri: data})
      } else if (version === 2) {
        signClient.pair({uri: data});
      } 
    } catch (e) {
      console.log(e);
    }
  };

  if (hasPermission === null) {
    return <Center><Text colorScheme={'primary'}>Requesting for camera permission</Text></Center>;
  }
  if (hasPermission === false) {
    return <Center><Text colorScheme={'primary'}>No access to camera</Text></Center>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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