import { Indicator } from '.';

export
class Code {
  public constructor(private readonly ind: Indicator) {
    this.a();
    // console.log(this.symbols);
  }

  private get options() {
    return this.ind.option_names.length > 1;
  }

  private get results() {
    return this.ind.output_names.length > 1;
  }

  private ref_inputs: string[] = this.ind.input_names.slice();
  private ref_options: string[] = this.ind.option_names
    .map((name) => this.options ? `options.${name}` : name);
  private ref_outputs: string[] = this.ind.output_names
    .map((name) => this.results ? `results.${name}` : name);

  private a() {

  }

  public Code() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}(''}) {

}
    `.trim();
  }
}
