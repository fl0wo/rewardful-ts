import { RewardfulClient } from '../src';

test('hello', () => {
  expect(new RewardfulClient().sayHello()).toBe('hello, world!');
});