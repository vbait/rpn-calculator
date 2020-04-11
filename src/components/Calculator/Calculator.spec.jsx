import React from 'react';
import Calculator from './Calculator';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<Calculator />).toJSON();
  expect(tree).toMatchSnapshot();
});
