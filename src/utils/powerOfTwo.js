export function powerOfTwo(value) {
  return (Math.log(parseInt(value)) / Math.log(2)) % 1 === 0;
}