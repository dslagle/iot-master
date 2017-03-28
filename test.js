const ip = '::ffff:38.101.219.129';

let n = ip.replace(/^:{1,2}ffff:/, '');

console.log(n);