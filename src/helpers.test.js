import { lineId } from './helpers';

it('returns a sorted string of the 2 input elements', () => {
  const res = lineId(11,8);
  expect(res).toEqual('0000800011');
})