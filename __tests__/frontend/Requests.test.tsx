/* eslint-disable @typescript-eslint/no-var-requires */
import { shallow } from 'enzyme';
import React from 'react';

import Requests from '../../frontend/pages/walletConnect/v2/Requests'; // Adjust the path to your actual file structure

jest.mock('../../frontend/store/setting', () => ({
  deleteNotification: jest.fn(() => Promise.resolve()),
  getAllNotifications: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../frontend/service/walletConnect', () => ({
  signClient: {
    core: {
      pairing: {
        getPairings: jest.fn(() => []),
      },
    },
  },
}));

describe('Requests Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Requests navigation={null} route={null} />);

    // Check if some static text is present (update with actual text you want to check)
    // expect(wrapper.text()).toContain('Connection Request');
  });

  it('shows requests', async () => {
    const mockRequests = [
      // Mock some requests data
    ];

    // Mock the getRequests method with your data
    require('../../frontend/store/setting').getAllNotifications.mockImplementation(() => Promise.resolve(mockRequests));

    const wrapper = shallow(<Requests navigation={null} route={null} />);

    // Trigger any necessary updates, such as lifecycle methods or state changes
    await wrapper.update();

    // Add proper querying logic to find requests (e.g., testID or text content)
    // Example: expect(wrapper.find('Request').length).toBe(mockRequests.length);
  });

  it('deletes a request', async () => {
    const mockRequests = [
      // Mock some requests data
    ];

    require('../../frontend/store/setting').getAllNotifications.mockImplementation(() => Promise.resolve(mockRequests));

    const wrapper = shallow(<Requests navigation={null} route={null} />);

    // Add proper querying logic to find the delete button for a specific request (e.g., testID or text content)
    const deleteButton = wrapper.find('IconButton').first();

    deleteButton.simulate('press');

    // Assert that the request was deleted (e.g., it disappears from the list or a delete API is called)
    // You might need to write more specific expectations based on your component's behavior
  });
});
