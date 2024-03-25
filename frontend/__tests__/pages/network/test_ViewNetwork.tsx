import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViewNetwork from '../../../pages/network/ViewNetwork';
import Wrapper from '../../../components/TestWrapper';

describe('ViewNetwork', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Wrapper><ViewNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // // Assert that the component renders the network name
    // expect(getByText('Network Name')).toBeTruthy();

    // // Assert that the component renders the chain ID
    // expect(getByText('Chain Id: 123')).toBeTruthy();

    // // Assert that the component renders the symbol
    // expect(getByText('Symbol: XYZ')).toBeTruthy();

    // // Assert that the component renders the RPC URL
    // expect(getByText('RPC Url: https://example.com')).toBeTruthy();

    // // Assert that the component renders the input fields
    // expect(getByPlaceholderText('Enter Name')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Chain ID')).toBeTruthy();
    // expect(getByPlaceholderText('Enter RPC URL')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Symbol')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Block Explorer')).toBeTruthy();
  });

  it('allows editing network details', () => {
    const { getByText, getByPlaceholderText } = render(<Wrapper><ViewNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Click on the "Edit" button
    // fireEvent.press(getByText('Edit'));

    // // Assert that the component is in editing mode
    // expect(getByPlaceholderText('Enter Name')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Chain ID')).toBeTruthy();
    // expect(getByPlaceholderText('Enter RPC URL')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Symbol')).toBeTruthy();
    // expect(getByPlaceholderText('Enter Block Explorer')).toBeTruthy();
  });

  it('saves network details', () => {
    const { getByText, getByPlaceholderText } = render(<Wrapper><ViewNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Click on the "Edit" button
    // fireEvent.press(getByText('Edit'));

    // // Enter new values in the input fields
    // fireEvent.changeText(getByPlaceholderText('Enter Name'), 'New Network Name');
    // fireEvent.changeText(getByPlaceholderText('Enter Chain ID'), '456');
    // fireEvent.changeText(getByPlaceholderText('Enter RPC URL'), 'https://new-example.com');
    // fireEvent.changeText(getByPlaceholderText('Enter Symbol'), 'ABC');
    // fireEvent.changeText(getByPlaceholderText('Enter Block Explorer'), 'https://new-explorer.com');

    // // Click on the "Save" button
    // fireEvent.press(getByText('Save'));

    // // Assert that the component is no longer in editing mode
    // expect(getByPlaceholderText('Enter Name')).toBeFalsy();
    // expect(getByPlaceholderText('Enter Chain ID')).toBeFalsy();
    // expect(getByPlaceholderText('Enter RPC URL')).toBeFalsy();
    // expect(getByPlaceholderText('Enter Symbol')).toBeFalsy();
    // expect(getByPlaceholderText('Enter Block Explorer')).toBeFalsy();

    // // Assert that the component displays the updated network details
    // expect(getByText('New Network Name')).toBeTruthy();
    // expect(getByText('Chain Id: 456')).toBeTruthy();
    // expect(getByText('Symbol: ABC')).toBeTruthy();
    // expect(getByText('RPC Url: https://new-example.com')).toBeTruthy();
  });
});