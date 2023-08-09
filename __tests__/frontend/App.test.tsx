import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';

import App from '../../frontend/App';

Enzyme.configure({ adapter: new Adapter() });

test('renders correctly', () => {
  const wrapper = Enzyme.shallow(<App />);

  expect(wrapper.find({ testID: 'tid-message'}).contains('Loading...')).toBe(true);
});
