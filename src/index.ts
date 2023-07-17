import { t } from 'litebot';
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
interface TulindWASM {
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
function run_alone(
  tulind: TulindWASM,
  indicator_index: number,
  inputs: number[][],
  options: number[],
  outputs_size: number,
) {
  const size = inputs[0].length;
  const task_index = tulind._new_task(indicator_index, size);
  inputs.forEach((input, input_index) => input.forEach((num, offset) =>
    tulind._inputs_number(task_index, input_index, offset, num)
  ));
  options.forEach((option, offset) => tulind._options_number(task_index, offset, option));
  tulind._run_task(task_index);
  const outputs = new Array<number[]>(outputs_size);
  for (let output_index = 0; output_index < outputs_size; ++output_index) {
    outputs[output_index] = new Array<number>(size);
    for (let offset = 0; offset < size; ++offset)
      outputs[output_index][offset] = tulind._outputs_number(task_index, output_index, offset);
  }
  tulind._free_current();
  return outputs;
}

async function main() {
  const tulind: TulindWASM = await Tulind();
  console.log(1);
  const source = Array(100000 * 30).fill(0).map(() => Math.random() * 1000);
  console.log(2);
  const old_time = Date.now();
  const result = run_alone(tulind, 72, [source], [21], 1);
  // const result = t.sma(source, 21);
  console.log(Date.now() - old_time);
  console.log(3);
  console.log(result.length);
}

main();
