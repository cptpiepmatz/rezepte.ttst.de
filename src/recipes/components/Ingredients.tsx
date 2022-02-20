import {Component} from "react";

import RecipeOptions from "../RecipeOptions";

export default class Ingredients extends Component<RecipeOptions> {

  constructor(props: RecipeOptions) {
    super(props);
  }

  render() {
    if (!this.props.ingredients) return null;

    let gridElements: JSX.Element[] = [];
    let rowCounter: number = 1;
    function rowClass() {
      if (rowCounter % 2 === 0) return "row-even";
      return "row-odd";
    }
    for (let [label, ingredients] of Object.entries(this.props.ingredients)) {
      if (label !== "_") gridElements.push(
        <div
          className={rowClass()}
          style={{gridRow: rowCounter, gridColumn: 1}}
        />,
        <div
          key={label}
          className={"pt-3 has-text-centered " + rowClass()}
          style={{gridRow: rowCounter, gridColumn: "span 2"}}
        >
          <strong>
            {label}
          </strong>
        </div>,
        <div
          className={rowClass()}
          style={{gridRow: rowCounter++, gridColumn: 4}}
        />
      );
      for (let ingredient of ingredients!) {
        gridElements.push(
          <div
            className={rowClass()}
            style={{gridRow: rowCounter, gridColumn: 1}}
          />,
          <div
            key={`${label}.${ingredient}.unit`}
            className={rowClass()}
            style={{
              gridRow: rowCounter,
              gridColumn: 2,
              padding: "0 1rem 0.3rem 1rem"
            }}
          >
            {ingredient.amountToString()} {ingredient.unit}
          </div>,
          <div
            key={`${label}.${ingredient}.description`}
            className={rowClass()}
            style={{
              gridRow: rowCounter,
              gridColumn: 3,
              maxWidth: "calc(60vw - 2rem)",
              padding: "0 1rem 0.3rem 0"
            }}
          >
            {ingredient.description}
          </div>,
          <div
            className={rowClass()}
            style={{gridRow: rowCounter++, gridColumn: 4}}
          />
        )
      }
    }

    return <>
      <div className={"container"}>
        <p className={"title is-4 has-text-centered is-hidden-mobile"}>
          Zutaten
        </p>
        <p
          className={"title is-4 has-text-centered is-hidden-tablet"}
          style={{marginBottom: "1rem"}}
        >
          Zutaten
        </p>
        <div className={"container"}>
          <div className={"ingredients"} style={{
            display: "grid",
            gridTemplateColumns: "1fr max-content max-content 1fr",
            columnGap: 0,
            rowGap: 0
          }}>
            {gridElements}
          </div>
        </div>
      </div>
    </>
  }
}
