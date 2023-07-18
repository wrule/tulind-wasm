import { Indicator } from '.';

export
class Code {
  public constructor(private readonly ind: Indicator) { }

  private get options() {
    return this.ind.option_names.length > 1;
  }

  private option_name(name: string) {
    return this.options ? `options.${name}` : name;
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
