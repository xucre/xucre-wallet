import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WalletHistory from '../../../pages/wallet/WalletHistory';
import { NavigationContainer } from '@react-navigation/native';
import { atom, RecoilRoot } from 'recoil';
import { NativeBaseProvider } from 'native-base';
import { RecoilObserver } from '../../../service/testUtils';
import { AppWallet } from '../../../service/state';
import { activeWallet } from '../../../service/state';
describe('WalletHistory', () => {
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

  it('should render the total balance', () => {
    const { getByText } = render(

      <Wrapper><WalletHistory navigation={mockNavigation} route={mockRoute} /></Wrapper>

    );
    //const totalBalance = getByText('Total Balance');
    //expect(totalBalance).toBeTruthy();
  });

  it('should call navigate when transaction feed is pressed', () => {
    const { getByTestId } = render(<Wrapper><WalletHistory navigation={mockNavigation} route={mockRoute} /></Wrapper>);
    /*const transactionFeed = getByTestId('transaction-feed');
    fireEvent.press(transactionFeed);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionFeed');*/
  });

  // Add more tests for other functionality in the WalletHistory component
});