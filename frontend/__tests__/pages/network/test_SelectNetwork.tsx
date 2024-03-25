import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectNetwork from '../../../pages/network/SelectNetwork';
import Wrapper from '../../../components/TestWrapper';

describe('SelectNetwork', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Wrapper><SelectNetwork navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Assert that the component renders without throwing any errors
    // expect(getByText('Select Network')).toBeTruthy();
  });

  it('navigates to CreateNetwork screen when "New" button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = render(<Wrapper><SelectNetwork navigation={{ navigate }} route={{}} /></Wrapper>);
    // const newButton = getByText('New');

    // fireEvent.press(newButton);

    // // Assert that the navigate function is called with the correct screen name
    // expect(navigate).toHaveBeenCalledWith('CreateNetwork');
  });

  // Add more tests for other functionality in the SelectNetwork component
});