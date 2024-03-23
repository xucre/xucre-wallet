import React from 'react';
import { render } from '@testing-library/react-native';
import { AppWrapper } from '../App';

describe('AppWrapper', () => {
  it('renders without crashing', () => {
    render(<AppWrapper />);
    // Add your assertions here
  });

  // Add more test cases as needed
});