const Tulind = require('./tulind.js');

async function main() {
  const tulind = await Tulind();
  console.log(tulind._new_task(1, 100, 1, 1, 1));
  console.log(tulind._new_task(1, 100, 1, 1, 1));
  console.log(tulind._new_task(1, 100, 1, 1, 1));
}

main();
