const Tulind = require('./tulind.js');

async function main() {
  const tulind = await Tulind();
  const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const task_index = tulind._new_task(72, 10, 1, 1, 1);
  tulind._inputs_number(0, 0, 0, 13);
  console.log(tulind._outputs_number(0, 0, 0));
}

main();
