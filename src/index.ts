const Tulind = require('./tulind.js');

export
interface Tulind_WASM {
  _new_task: (indicator_index: number, size: number) => number;
  _inputs_number: (
    task_index: number,
    input_index: number,
    offset: number,
    number: number,
  ) => void;
  _inputs_map: (
    task_index: number,
    input_index: number,
    target_index: number,
    is_outputs: number,
    data_index: number,
  ) => void;
  _options_number: (
    task_index: number,
    offset: number,
    number: number,
  ) => void;
  _outputs_number: (
    task_index: number,
    output_index: number,
    offset: number,
  ) => void;
  _link_task: (task_index: number) => void,
  _run_task: (task_index: number) => void,
  _run: (task_index: number) => void,
}

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
