import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NftDashboard from '../../../pages/nft/NftDashboard';
import Wrapper from '../../../components/TestWrapper';

describe('NftDashboard', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<Wrapper><NftDashboard navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);

    // Wait for the component to finish rendering
    // await waitFor(() => {
    //   expect(getByText('Trending')).toBeTruthy();
    //   expect(getByText('Collections')).toBeTruthy();
    //   expect(getByText('Your List')).toBeTruthy();
    // });
  });

  // Add more test cases here...
});