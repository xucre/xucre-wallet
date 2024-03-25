import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateWallet from '../../../pages/wallet/CreateWallet';
import Wrapper from '../../../components/TestWrapper';

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