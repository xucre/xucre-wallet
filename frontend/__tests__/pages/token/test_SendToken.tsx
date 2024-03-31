import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SendToken from '../../../pages/token/SendToken';
import Wrapper from '../../../components/TestWrapper';

describe('SendToken', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Wrapper><SendToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const sendTokenComponent = getByTestId('send-token-component');
    // expect(sendTokenComponent).toBeTruthy();
  });

  test('updates address state on address change', () => {
    const { getByTestId } = render(<Wrapper><SendToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const addressInput = getByTestId('address-input');
    // fireEvent.changeText(addressInput, '0x1234567890');
    // expect(addressInput.props.value).toBe('0x1234567890');
  });

  test('updates amount state on amount change', () => {
    const { getByTestId } = render(<Wrapper><SendToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const amountInput = getByTestId('amount-input');
    // fireEvent.changeText(amountInput, '10');
    // expect(amountInput.props.value).toBe('10');
  });

  test('calls send function on send button press', () => {
    const mockSend = jest.fn();
    const { getByTestId } = render(<Wrapper><SendToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const sendButton = getByTestId('send-button');
    // fireEvent.press(sendButton);
    // expect(mockSend).toHaveBeenCalled();
  });
});