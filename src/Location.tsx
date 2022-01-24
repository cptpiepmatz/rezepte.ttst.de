import {cloneElement} from "react";
import {useLocation} from "react-router-dom";

export default function Location(props: any) {
  let locatedProps = Object.assign({}, props, useLocation());
  delete locatedProps.children;
  return cloneElement(props.children, locatedProps);
}
