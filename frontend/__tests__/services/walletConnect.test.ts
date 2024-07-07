import { Mixpanel } from 'mixpanel-react-native';
import { createSignClient, parseRequestParams, goBack, signClient, mixpanel } from '../../service/walletConnect';

describe('walletConnect', () => {
  describe('createSignClient', () => {
    it('should create a sign client with the provided mixpanel instance', async () => {
      // Mock Mixpanel instance
      const _mixpanel = {} as Mixpanel;

      // Call the function
      await createSignClient(_mixpanel);

      // Assert that the signClient is created with the provided mixpanel instance
      expect(signClient).toBeDefined();
      expect(mixpanel).toBe(_mixpanel);
    });
  });

  describe('parseRequestParams', () => {
    it('should parse the request parameters and return the parsed result', () => {
      // Mock request parameters
      const params = {
        optionalNamespaces: {
          eip155: {
            chains: ['chain1', 'chain2'],
            events: ['event1', 'event2'],
            methods: ['method1', 'method2'],
          },
        },
        requiredNamespaces: {
          eip155: {
            chains: ['chain3', 'chain4'],
            events: ['event3', 'event4'],
            methods: ['method3', 'method4'],
          },
        },
      };

      // Call the function
      const result = parseRequestParams(params);

      // Assert that the result is the expected parsed object
      expect(result).toEqual({
        optionalNamespaces: {
          eip155: {
            chains: ['chain1', 'chain2'],
            events: ['event1', 'event2'],
            methods: ['method1', 'method2'],
          },
        },
        requiredNamespaces: {
          eip155: {
            chains: ['chain3', 'chain4'],
            events: ['event3', 'event4'],
            methods: ['method3', 'method4'],
          },
        },
      });
    });
  });

  describe('goBack', () => {
    it('should navigate back to the previous screen', () => {
      // Mock request and navigation objects
      const request = {};
      const navigation = {
        navigate: jest.fn(),
      };

      // Call the function
      goBack(request, navigation);

      // Assert that the navigate function is called with the expected arguments
      expect(navigation.navigate).toHaveBeenCalledWith('PreviousScreen');
    });
  });
});