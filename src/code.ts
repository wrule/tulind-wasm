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

  private get argsCode() {
    const inputs = this.ind.input_names.map((name) => `${name}: number`).join(', ');
    const options = this.ind.options ?
      `options: { ${this.ind.option_names.map((name) => `${name}: number`).join(', ')} }` :
      this.ind.option_names.map((name) => `${name}: number`).join(', ');
    return [inputs, options].filter((item) => item).join(', ');
  }

  public Code() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}(${this.argsCode}) {
  const outputs = run_alone(tulind, ${this.ind.index}, [${this.ind.input_names.map((name) => name).join(', ')}]);
}
    `.trim();
  }
}
