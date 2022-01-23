import {Component} from "react";

import RecipeOptions from "../RecipeOptions";

export default class Ingredients extends Component<RecipeOptions> {

  constructor(props: RecipeOptions) {
    super(props);
  }

  render() {
    if (!this.props.ingredients) return null;

    let tableRows: JSX.Element[] = [];
    for (let [label, ingredients] of Object.entries(this.props.ingredients)) {
      if (label !== "_") tableRows.push(
        <tr key={`${label}`}>
          <td className={"pt-2"}>
            <strong>
              {label}
            </strong>
          </td>
        </tr>
      );
      for (let ingredient of ingredients!) {
        tableRows.push(
          <tr key={`${label}.${ingredient.description}`}>
            <td>
              {ingredient.amountToString()} {ingredient.unit}
            </td>
            <td className={"pl-2"}>
              {ingredient.description}
            </td>
          </tr>
        );
      }
    }

    return <>
      <div className={"container"}>
        <p className={"title is-4 has-text-centered"}>Zutaten</p>
        <table className={"container"}>
          <tbody>
          {tableRows}
          </tbody>
        </table>
      </div>
    </>
  }
}
