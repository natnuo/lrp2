import * as Plot from "@observablehq/plot";
import {createElement as h} from "react";

export const PlotFigure = ({options}: {options: Plot.PlotOptions}) => {
  return (Plot.plot({...options, document: new Document()}) as any).toHyperText();
};
