/**
 * Class representing one ingredient, including the amount and unit of the
 * ingredient.
 */
export default class Ingredient {

  /** The quantitative amount of the ingredient. */
  readonly amount?: number;

  /** The unit the amount is measured in. */
  readonly unit?: string;

  /** The name of the ingredient itself. */
  readonly description?: string;

  /**
   * Constructor.
   *
   * Amount and unit may be empty but a unit requires the amount.
   * @param amount The amount of the ingredient, optional.
   * @param unit The unit of the ingredient, if given, the amount is required.
   * @param description The name of the ingredient.
   */
  constructor(
    amount: string|number,
    unit: string,
    description: string
  ) {
    this.description = description?.trim();

    if (amount !== "") {
      switch (typeof amount) {
        case "number":
          // if the amount is number, use it directly
          this.amount = amount;
          break;
        case "string":
          // if the amount is a string, try to parse
          amount = amount.trim();
          let fractionMatch = amount.match(
            /(?<dividend>\d+)\/(?<divisor>\d+)/
          );
          if (fractionMatch && fractionMatch.groups!.divisor) {
            // if a fraction can be found in the string, it will be parsed as such
            let {dividend, divisor} = fractionMatch.groups!;
            this.amount = parseInt(dividend) / parseInt(divisor);
            break;
          }
          this.amount = parseFloat(amount);
          // no fraction found, parse directly
          break;
      }
    }

    this.unit = unit?.trim() ? unit.trim() : undefined;
  }

  /**
   * The amount rendered as a string.
   * Either directly a number or a specific fraction.
   * @param scale The scale the amount should be multiplied with to be rendered.
   */
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

  /**
   * Returns the ingredient as a string.
   *
   * The scale will be passed to {@link amountToString}.
   * @param scale The scale the amount should be multiplied with to be rendered.
   */
  toString(scale: number = 1): string {
    let output = "";
    if (this.amount) output += this.amountToString(scale) + " ";
    if (this.unit) output += this.unit + " ";
    return output + this.description;
  }

}
