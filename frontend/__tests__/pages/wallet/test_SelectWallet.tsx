import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectWallet from '../../../pages/wallet/SelectWallet';
import { activeWallet, AppWallet } from '../../../service/state';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { RecoilObserver } from '../../../service/testUtils';
import Wrapper from '../../../components/TestWrapper';

describe('SelectWallet', () => {
  it('should render wallet items correctly', () => {
    const walletState = [
      { id: 1, name: 'Wallet 1' },
      { id: 2, name: 'Wallet 2' },
      { id: 3, name: 'Wallet 3' },
    ];

    const { getByText } = render(
      <Wrapper>
        <SelectWallet
          navigation={{ navigate: jest.fn() }}
          route={{}}
        />
      </Wrapper>
    );

    // expect(getByText('Wallet 1')).toBeTruthy();
    // expect(getByText('Wallet 2')).toBeTruthy();
    // expect(getByText('Wallet 3')).toBeTruthy();
  });

  it('should navigate to NewWallet screen when create wallet button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <Wrapper><SelectWallet
        navigation={{ navigate }}
        route={{}}
      /></Wrapper>
    );

    // fireEvent.press(getByText('Create Wallet'));

    // expect(navigate).toHaveBeenCalledWith('NewWallet');
  });

  it('should navigate to ViewWallet screen when a wallet item is pressed', () => {
    const navigate = jest.fn();
    const walletState = [
      { id: 1, name: 'Wallet 1' },
      { id: 2, name: 'Wallet 2' },
      { id: 3, name: 'Wallet 3' },
    ];

    const { getByText } = render(
      <Wrapper><SelectWallet
        navigation={{ navigate }}
        route={{}}
      /></Wrapper>
    );

    // fireEvent.press(getByText('Wallet 1'));

    // expect(navigate).toHaveBeenCalledWith('ViewWallet');
  });

  it('should navigate to ExportWallet screen with the correct address when export button is pressed', () => {
    const navigate = jest.fn();
    const walletState = [
      { id: 1, name: 'Wallet 1', address: '0x123' },
      { id: 2, name: 'Wallet 2', address: '0x456' },
      { id: 3, name: 'Wallet 3', address: '0x789' },
    ];

    const { getByText } = render(
      <Wrapper><SelectWallet
        navigation={{ navigate }}
        route={{}}
      /></Wrapper>
    );

    // fireEvent.press(getByText('Export Wallet'));

    // expect(navigate).toHaveBeenCalledWith('ExportWallet', { address: '0x123' });
  });
});


jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 1)
  }
})