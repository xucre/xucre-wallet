import { parseUri } from '@walletconnect/utils'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';
import { Box, Center, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Button, Linking, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';

import { activeWallet } from '../../../service/state';
import translations from "../../../assets/translations";
import { language as stateLanguage } from "../../../service/state";
import { Wallet } from 'ethers';
import { WalletInternal } from '../../../store/wallet';

export default function UnlimitWidget({ navigation }: { navigation: { navigate: Function, goBack: Function } }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [scanned, setScanned] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  /*const ramp = new RampSdk().on('*', (event) => {
    if (event.type === 'WIDGET_CLOSE') {
      navigation.goBack();
    }
  });*/
  useEffect(() => {
    let isMounted = true;
    if (_wallet) {
      const hostApiKey = 'u3tz8szbe6xef5o647ufwtqd65235wfttw8aq8ob';
      const hostAppName = 'Xucre Wallet';
      const hostLogoUrl = 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre_logo.png';
      /*ramp.show({
        url: 'https://app.demo.ramp.network',
        hostAppName: hostAppName,
        hostLogoUrl: hostLogoUrl,
        enabledFlows: ['ONRAMP', 'OFFRAMP'],
        defaultFlow: 'ONRAMP',
        hostApiKey: hostApiKey
      })*/
      const runAsync = async () => {
        if (isMounted) await Linking.openURL(`https://app.demo.ramp.network?hostApiKey=${hostApiKey}&hostAppName=${hostAppName}&hostLogoUrl=${hostLogoUrl}&userAddress=${_wallet.address}`);
      }
      runAsync();

    }
    return () => { isMounted = false }
  }, [_wallet]);

  return (
    <View style={styles.container}>

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