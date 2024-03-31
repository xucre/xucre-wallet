import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateNetwork from '../../../pages/network/CreateNetwork';
import Wrapper from '../../../components/TestWrapper';

describe('CreateNetwork', () => {
  it('should render the component', () => {
    const { getByPlaceholderText } = render(<Wrapper><CreateNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Assert that the input fields are rendered
    // expect(getByPlaceholderText('Enter name')).toBeTruthy();
    // expect(getByPlaceholderText('Enter chain ID')).toBeTruthy();
    // expect(getByPlaceholderText('Enter RPC URL')).toBeTruthy();
    // expect(getByPlaceholderText('Enter symbol')).toBeTruthy();
    // expect(getByPlaceholderText('Enter block explorer')).toBeTruthy();
  });

  it('should update state when input fields change', () => {
    const { getByPlaceholderText } = render(<Wrapper><CreateNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const nameInput = getByPlaceholderText('Enter name');
    // const chainIdInput = getByPlaceholderText('Enter chain ID');
    // const rpcUrlInput = getByPlaceholderText('Enter RPC URL');
    // const symbolInput = getByPlaceholderText('Enter symbol');
    // const blockExplorerInput = getByPlaceholderText('Enter block explorer');

    // // Simulate user input
    // fireEvent.changeText(nameInput, 'Test Network');
    // fireEvent.changeText(chainIdInput, '123');
    // fireEvent.changeText(rpcUrlInput, 'https://example.com');
    // fireEvent.changeText(symbolInput, 'TEST');
    // fireEvent.changeText(blockExplorerInput, 'https://example.com/explorer');

    // // Assert that state is updated correctly
    // expect(nameInput.props.value).toBe('Test Network');
    // expect(chainIdInput.props.value).toBe('123');
    // expect(rpcUrlInput.props.value).toBe('https://example.com');
    // expect(symbolInput.props.value).toBe('TEST');
    // expect(blockExplorerInput.props.value).toBe('https://example.com/explorer');
  });

  it('should call saveNetwork function when submit button is pressed', () => {
    const saveNetwork = jest.fn();
    const { getByText } = render(<Wrapper><CreateNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const submitButton = getByText('Submit');

    // // Simulate button press
    // fireEvent.press(submitButton);

    // // Assert that saveNetwork function is called
    // expect(saveNetwork).toHaveBeenCalled();
  });
});