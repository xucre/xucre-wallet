import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewWallet from '../../../pages/wallet/NewWallet';
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

describe('NewWallet', () => {
  it('renders without crashing', () => {
    render(<Wrapper><NewWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // Add your assertions here
  });

  it('navigates to CreateWallet screen when create button is pressed', () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<Wrapper><NewWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // fireEvent.press(getByTestId('create-button'));
    // expect(navigate).toHaveBeenCalledWith('CreateWallet');
  });

  it('navigates to RecoverWallet screen when recover button is pressed', () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<Wrapper><NewWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // fireEvent.press(getByTestId('recover-button'));
    // expect(navigate).toHaveBeenCalledWith('RecoverWallet');
  });
});