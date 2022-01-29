export default class Ingredient {

  readonly amount?: number;
  readonly unit?: string;
  readonly description?: string;

  constructor(
    amount: string|number,
    unit: string,
    description: string
  ) {
    this.description = description?.trim();

    if (amount !== "") {
      switch (typeof amount) {
        case "number":
          this.amount = amount;
          break;
        case "string":
          amount = amount.trim();
          let fractionMatch = amount.match(
            /(?<dividend>\d+)\/(?<divisor>\d+)/
          );
          if (fractionMatch && fractionMatch.groups!.divisor) {
            let {dividend, divisor} = fractionMatch.groups!;
            this.amount = parseInt(dividend) / parseInt(divisor);
            break;
          }
          this.amount = parseFloat(amount);
          break;
      }
    }

    this.unit = unit?.trim() ? unit.trim() : undefined;
  }

  amountToString(scale: number = 1): string {
    if (!this.amount) return "";
    let outAmount = (this.amount ?? 0) * scale;
    switch (outAmount) {
      case 0.5: return "½";
      case 0.25: return "¼";
      case 0.75: return "¾";
      default: return `${outAmount}`;
    }
  }

  toString(scale: number = 1): string {
    let output = "";
    if (this.amount) output += this.amountToString(scale) + " ";
    if (this.unit) output += this.unit + " ";
    return output + this.description;
  }

}
