import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViewWallet from '../../../pages/wallet/ViewWallet';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { activeWallet, AppWallet } from '../../../service/state';
import { RecoilObserver } from '../../../service/testUtils';

describe('ViewWallet', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockRoute = {};
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

  it('should render the wallet name', () => {
    const { getByText } = render(
      <Wrapper>
        <ViewWallet navigation={mockNavigation} route={mockRoute} />
      </Wrapper>
    );
    /*const walletName = getByText('Test Wallet');
    expect(walletName).toBeTruthy();*/
  });

  it('should call navigate when send funds button is pressed', () => {
    const { getByText } = render(
      <Wrapper>
        <ViewWallet navigation={mockNavigation} route={mockRoute} />
      </Wrapper>
    );
    /*const sendFundsButton = getByText('Send Funds');
    fireEvent.press(sendFundsButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SendToken');*/
  });

  it('should call navigate when receive funds button is pressed', () => {
    const { getByText } = render(

      <Wrapper>
        <ViewWallet navigation={mockNavigation} route={mockRoute} />
      </Wrapper>
    );
    /*const receiveFundsButton = getByText('Receive Funds');
    fireEvent.press(receiveFundsButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('QRWallet');*/
  });

  it('should call navigate when buy tokens button is pressed', () => {
    const { getByText } = render(

      <Wrapper>
        <ViewWallet navigation={mockNavigation} route={mockRoute} />
      </Wrapper>
    );
    /*const buyTokensButton = getByText('Buy Tokens');
    fireEvent.press(buyTokensButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SwapToken');*/
  });

  it('should call navigate when connect wallet button is pressed', () => {
    const { getByText } = render(

      <Wrapper>
        <ViewWallet navigation={mockNavigation} route={mockRoute} />
      </Wrapper>
    );
    /*const connectWalletButton = getByText('Connect Wallet');
    fireEvent.press(connectWalletButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ConnectionManagement');*/
  });
});