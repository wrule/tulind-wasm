const Tulind = require('./tulind.js');

export
interface Indicator {
  index: number;
  name: string;
  full_name: string;
  type: number;
  inputs: number;
  options: number;
  outputs: number;
  input_names: string[];
  option_names: string[];
  output_names: string[];
}
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

export
function single_run(
  tulind: Tulind_WASM,
  indicator_index: number,
  inputs: number[][],
  options: number[],
  outputs_size: number,
) {
  const size = inputs[0].length;
  const task_index = tulind._new_task(indicator_index, size);
  inputs.forEach((row, input_index) => row.forEach((num, offset) => {
    tulind._inputs_number(task_index, input_index, offset, num);
  }));
  options.forEach((num, offset) => tulind._options_number(task_index, offset, num));
  
  tulind._run_task(task_index);
  
  const outputs = new Array<number[]>(outputs_size);
  for (let index = 0; index < outputs_size; ++index) {
    outputs[index] = new Array<number>(size);
    for (let offset = 0; offset < size; ++offset)
      outputs[index][offset] = tulind._outputs_number(task_index, index, offset);
  }
  tulind._free_current();
  return outputs;
}

async function main() {
  const tulind: Tulind_WASM = await Tulind();
  const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = single_run(tulind, 72, [source], [2], 1);
  console.log(a);
}

main();
