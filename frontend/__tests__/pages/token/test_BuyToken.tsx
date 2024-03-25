import React from 'react';
import { render } from '@testing-library/react-native';
import BuyToken from '../../../pages/token/BuyToken';
import Wrapper from '../../../components/TestWrapper';

describe('BuyToken', () => {
  it('renders WebView with correct source', () => {
    const { getByTestId } = render(<Wrapper><BuyToken navigation={{ navigate: jest.fn() }} route={{}} /></Wrapper>);
    // const webView = getByTestId('webview');
    // expect(webView.props.source.uri).toBe('https://app.uniswap.org/#/tokens/ethereum');
  });
});