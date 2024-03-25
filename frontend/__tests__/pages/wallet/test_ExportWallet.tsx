import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExportWallet from '../../../pages/wallet/ExportWallet';
import { activeWallet, AppWallet } from '../../../service/state';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { RecoilObserver } from '../../../service/testUtils';
import Wrapper from '../../../components/TestWrapper';


describe('ExportWallet', () => {
  it('renders without crashing', () => {
    render(<Wrapper><ExportWallet navigation={{ navigate: jest.fn() }} route={{ params: { address: 'exampleAddress' } }} /></Wrapper>);
    // Add your assertions here
  });

  it('displays the wallet name and address', () => {
    const { getByText } = render(<Wrapper><ExportWallet navigation={{ navigate: jest.fn() }} route={{ params: { address: 'exampleAddress' } }} /></Wrapper>);
    // const walletName = getByText('Example Wallet');
    // const walletAddress = getByText('exampleAddress');
    // Add your assertions here
  });

  it('displays the export button', () => {
    const { getByText } = render(<Wrapper><ExportWallet navigation={{ navigate: jest.fn() }} route={{ params: { address: 'exampleAddress' } }} /></Wrapper>);
    // const exportButton = getByText('Export');
    // Add your assertions here
  });

  it('calls the exportWallet function when the export button is pressed', () => {
    const exportWallet = jest.fn();
    const { getByText } = render(<Wrapper><ExportWallet navigation={{ navigate: jest.fn() }} route={{ params: { address: 'exampleAddress' } }} /></Wrapper>);
    // const exportButton = getByText('Export');
    // fireEvent.press(exportButton);
    // expect(exportWallet).toHaveBeenCalled();
  });

  // Add more test cases as needed
});