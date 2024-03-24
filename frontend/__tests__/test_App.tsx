import React from 'react';
import { render } from '@testing-library/react-native';
import App, { AppWrapper } from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add your assertions here
  });

  // Add more test cases as needed
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 1)
  }
})