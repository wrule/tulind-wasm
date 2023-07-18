import { Indicator } from '.';

export
class Code {
  public constructor(private readonly ind: Indicator) { }

  private get options() {
    return this.ind.option_names.length > 1;
  }

  private optionName(name: string) {
    return this.options ? `options.${name}` : name;
  }

  private names(list: string[], type: 'number' | 'options' | 'outputs' | '' = 'number') {
    return list.map((name, index) => {
      if (type === 'number') return `${name}: number`;
      if (type === 'options') return `options.${name}`;
      if (type === 'outputs') return `${name}: outputs[${index}]`;
      return name;
    }).join(', ');
  }

  private get argsCode() {
    const inputs = this.names(this.ind.input_names);
    const options = this.options ?
      `options: { ${this.names(this.ind.option_names)} }` :
      this.names(this.ind.option_names);
    return [inputs, options].filter((item) => item).join(', ');
  }

  public Code() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}(${this.argsCode}) {
  const outputs = run_alone(tulind, ${this.ind.index}, [${
    this.names(this.ind.input_names, '')
  }], [${
    this.names(this.ind.option_names, this.options ? 'options' : '')
  }], ${this.ind.outputs});
}
    `.trim();
  }
}
