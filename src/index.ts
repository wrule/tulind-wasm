import { t } from 'litebot';
import { Code } from './code';
const Tulind = require('./tulind.js');
const tlist: Indicator[] = require('./1.json');

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
  inputs.forEach((input, input_index) => {
    for (let offset = 0; offset < size; ++offset)
      tulind._inputs_number(task_index, input_index, offset, input[offset]);
  });
  options.forEach((option, offset) => tulind._options_number(task_index, offset, option));
  tulind._run_task(task_index);
  const outputs_offset = tulind._outputs_offset(task_index);
  const outputs = new Array<number[]>(outputs_size);
  for (let output_index = 0; output_index < outputs_size; ++output_index) {
    outputs[output_index] = new Array<number>(size);
    for (let offset = 0; offset < size; ++offset)
      outputs[output_index][offset] = offset >= outputs_offset ?
        tulind._outputs_number(task_index, output_index, offset) :
        NaN;
  }
  outputs.push([outputs_offset]);
  tulind._free_current();
  return outputs;
}

export
function indicator_params_code(indicator: Indicator) {
  return indicator.input_names.map((name) => `${name}: number`).join(', ');
}

export
function indicator_options_code(indicator: Indicator) {
  if (indicator.options < 1) return '';
  if (indicator.options === 1) return `${indicator.option_names[0]}: number`;
  return `options: { ${indicator.option_names.map((name) => `${name}: number`).join(', ')} }`;
}

/**
 * 你好，世界
 */
export
function indicator_code(indicator: Indicator) {
  return `
/**
 * ${indicator.full_name}
 */
export
function ${indicator.name}(${indicator_params_code(indicator)}${
  indicator_options_code(indicator) ? `, ${indicator_options_code(indicator)}` : ''
}) {
  const outputs = run_alone(tulind, )
}`.trim();
}


async function main() {
  tlist.forEach((ind) => {
    console.log(new Code(ind).Code());
    console.log();
  });
  return;
  const tulind: TulindWASM = await Tulind();
  console.log(1);
  const source = Array(10000000).fill(0).map(() => Math.random() * 1000);
  console.log(2);
  const old_time = Date.now();
  const result = run_alone(tulind, 72, [source], [4], 1);
  // const result = t.sma(source, 21);
  console.log(Date.now() - old_time);
  console.log(3);
  // console.log(result);
}

main();
