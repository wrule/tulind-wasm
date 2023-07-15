const Tulind = require('./tulind.js');

async function main() {
  const tulind = await Tulind();
  const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const task_index = tulind._new_task(72, source.length, 0);
  source.forEach((number, x) => {
    tulind._inputs_number(task_index, x, 0, number);
  });
  tulind._options_number(task_index, 0, 2);
  tulind._run_task(task_index);
  source.forEach((_, x) => {
    console.log(tulind._outputs_number(task_index, x, 0));
  });
}

main();
