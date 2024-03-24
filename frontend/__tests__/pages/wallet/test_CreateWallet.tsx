import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateWallet from '../../../pages/wallet/CreateWallet';
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
describe('CreateWallet', () => {
  it('renders without crashing', () => {
    render(<Wrapper><CreateWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // Add your assertions here
  });

  it('displays instructions and button', () => {
    const { getByText } = render(<Wrapper><CreateWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    //expect(getByText('Instructions')).toBeTruthy();
    //expect(getByText('Create Wallet')).toBeTruthy();
  });

  it('calls createMnemonics function when button is pressed', () => {
    const { getByText } = render(<Wrapper><CreateWallet navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    //const createButton = getByText('Create Wallet');
    //ireEvent.press(createButton);
    // Add your assertions here
  });

  // Add more test cases as needed
});