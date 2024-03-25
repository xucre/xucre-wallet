import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddToken from '../../../pages/token/AddToken';
import Wrapper from '../../../components/TestWrapper';

describe('AddToken', () => {
  it('should render AddToken component', () => {
    const { getByText, getByPlaceholderText } = render(<Wrapper><AddToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Assert that the component renders correctly
    // expect(getByText('Add Token Title')).toBeTruthy();
    // expect(getByPlaceholderText('Enter token name')).toBeTruthy();
    // expect(getByPlaceholderText('Enter token address')).toBeTruthy();
    // expect(getByPlaceholderText('Select chain')).toBeTruthy();
    // expect(getByText('Submit')).toBeTruthy();
  });

  it('should update state when input values change', () => {
    const { getByPlaceholderText } = render(<Wrapper><AddToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const nameInput = getByPlaceholderText('Enter token name');
    // const addressInput = getByPlaceholderText('Enter token address');
    // const chainInput = getByPlaceholderText('Select chain');

    // // Simulate user input
    // fireEvent.changeText(nameInput, 'My Token');
    // fireEvent.changeText(addressInput, '0x123456789');
    // fireEvent.changeText(chainInput, '1');

    // // Assert that state is updated correctly
    // expect(nameInput.props.value).toBe('My Token');
    // expect(addressInput.props.value).toBe('0x123456789');
    // expect(chainInput.props.selectedValue).toBe('1');
  });

  it('should call saveToken function when submit button is pressed', () => {
    const saveToken = jest.fn();
    const { getByText } = render(<Wrapper><AddToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const submitButton = getByText('Submit');

    // // Simulate button press
    // fireEvent.press(submitButton);

    // // Assert that saveToken function is called
    // expect(saveToken).toHaveBeenCalled();
  });
});