const Tulind = require('./tulind.js');

export
interface Tulind_WASM {
  _free_task: (task_index: number) => void;
  _free_current: () => void;
  _reset: () => void;
  _init: () => void;
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
  ) => number;
  _get_inputs_number: (
    task_index: number,
    input_index: number,
    offset: number,
  ) => number;
  _inputs_offset: (task_index: number) => number;
  _outputs_offset: (task_index: number) => number;
  _link_task: (task_index: number) => void,
  _run_task: (task_index: number) => void,
  _run: (start_index: number, end_index: number) => void,
}

async function main() {
  const tulind: Tulind_WASM = await Tulind();
  const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const task_index = tulind._new_task(72, source.length);
  source.forEach((number, offset) => {
    tulind._inputs_number(task_index, 0, offset, number);
  });
  tulind._options_number(task_index, 0, 2);
  const b = tulind._new_task(72, source.length);
  tulind._inputs_map(b, 0, task_index, 1, 0);
  tulind._options_number(b, 0, 3);
  tulind._run(0, 1);
  source.forEach((_, offset) => {
    console.log(tulind._outputs_number(task_index, 0, offset));
  });
  console.log('');
  source.forEach((_, offset) => {
    console.log(tulind._outputs_number(b, 0, offset));
  });
}

main();
