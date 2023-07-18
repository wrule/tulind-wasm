import { Indicator } from '.';

export
class Code {
  public constructor(private readonly ind: Indicator) { }

  public Code() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}() {

}
    `.trim();
  }
}
