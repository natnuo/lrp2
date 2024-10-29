import { Chart, ChartConfiguration } from "chart.js";
import { useEffect, useReducer, useRef } from "react";

export const PlotFigure = ({options}: {options: ChartConfiguration}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [, setChart] = useReducer((state: Chart | undefined) => {
    if (!ref.current) return state;
    state?.destroy();
    return new Chart(ref.current, options);
  }, undefined);
  useEffect(() => {  // TODO: FIX CANVAS ALREADY IN USE BUG
    setChart();
  }, [options]);
  return (<canvas ref={ref} id={Date.now() + "" + Math.random()}></canvas>);
};
