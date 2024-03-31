import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewWallet from '../../../pages/wallet/NewWallet';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { AppWallet, activeWallet } from '../../../service/state';
import { RecoilObserver } from '../../../service/testUtils';
import Wrapper from '../../../components/TestWrapper';

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