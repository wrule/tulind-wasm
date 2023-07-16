const Tulind = require('./tulind.js');

async function main() {
  const tulind = await Tulind();
  const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const task_index = tulind._new_task(72, source.length);
  source.forEach((number, offset) => {
    tulind._inputs_number(task_index, 0, offset, number);
  });
  tulind._options_number(task_index, 0, 3);
  tulind._run();
  source.forEach((_, offset) => {
    console.log(tulind._outputs_number(task_index, 0, offset));
  });
}

main();
