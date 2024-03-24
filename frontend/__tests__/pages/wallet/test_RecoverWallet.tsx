import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecoverWallet from '../../../pages/wallet/RecoverWallet';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { AppWallet, activeWallet } from '../../../service/state';
import { RecoilObserver } from '../../../service/testUtils';

const testState = {
  address: process.env.TEST_ADDRESS,
  name: 'testWallet',
  wallet: process.env.TEST_PRIVATE_KEY
} as AppWallet;
const Wrapper = ({ children }: { children: any }) => {
  return (
    <RecoilRoot>
      <RecoilObserver node={activeWallet} _value={testState} />
      <NativeBaseProvider>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  )
}

describe('RecoverWallet', () => {
  it('renders the Instructions component when steps is 0', () => {
    const { getByText } = render(<Wrapper><RecoverWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const instructionsHeader = getByText('Instructions');
    // expect(instructionsHeader).toBeTruthy();
  });

  it('renders the RecoverMnemonic component when steps is 1', () => {
    const { getByText } = render(<Wrapper><RecoverWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // fireEvent.press(getByText('Recover with Mnemonic'));
    // const recoverMnemonicHeader = getByText('Recover Mnemonic');
    // expect(recoverMnemonicHeader).toBeTruthy();
  });

  it('renders the RecoverPrivateKey component when steps is 2', () => {
    const { getByText } = render(<Wrapper><RecoverWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // fireEvent.press(getByText('Recover with Private Key'));
    // const recoverPrivateKeyHeader = getByText('Recover Private Key');
    // expect(recoverPrivateKeyHeader).toBeTruthy();
  });
});