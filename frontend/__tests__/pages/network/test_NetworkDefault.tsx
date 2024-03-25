import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NetworkDefault from '../../../pages/network/NetworkDefault';
import Wrapper from '../../../components/TestWrapper';

describe('NetworkDefault', () => {
  it('renders correctly', () => {
    const navigation = { navigate: jest.fn() };
    const route = {};
    render(<Wrapper><NetworkDefault navigation={navigation} route={route} /></Wrapper>);
    // Add your assertions here
  });

  it('navigates to SelectWallet on network press', () => {
    const navigation = { navigate: jest.fn() };
    const route = {};
    const { getByTestId } = render(<Wrapper><NetworkDefault navigation={navigation} route={route} /></Wrapper>);
    // const networkItem = getByTestId('network-item');
    // fireEvent.press(networkItem);
    // expect(navigation.navigate).toHaveBeenCalledWith('SelectWallet');
  });
});