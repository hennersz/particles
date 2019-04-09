import Particle from './Particle';

it('should explode into parts that sum to the original weight', () => {
  const p = new Particle(10, 10, 10, 10, 50, 1);
  p.num = 4;
  const res = p.explode();
  expect(res.length).toEqual(3);
})