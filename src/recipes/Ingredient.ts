export default class Ingredient {

  readonly amount?: number;
  readonly unit?: string;

  constructor(
    amount: string|number,
    unit: string,
    readonly description: string
  ) {
    if (amount !== "") {
      switch (typeof amount) {
        case "number":
          this.amount = amount;
          break;
        case "string":
          let fractionMatch = amount.match(/(?<divident>\d+)\/(?<divisor>\d+)/);
          if (fractionMatch && fractionMatch.groups!.divisor) {
            let {dividend, divisor} = fractionMatch.groups!;
            this.amount = parseInt(dividend) / parseInt(divisor);
            break;
          }
          this.amount = parseFloat(amount);
          break;
      }
    }

    this.unit = unit ? unit : undefined;
  }

  toString(scale: number = 1): string {
    let output = "";
    if (this.amount) {
      let outAmount = this.amount * scale;
      switch (outAmount) {
        case 0.5:
          output += "½ ";
          break;
        case 0.25:
          output += "¼ ";
          break;
        case 0.75:
          output += "¾ ";
          break;
        default:
          output += outAmount;
      }
    }
    if (this.unit) output += this.unit + " ";
    return output + this.description;
  }

}
