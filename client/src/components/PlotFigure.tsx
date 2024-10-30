import { Chart, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";

Chart.register(...registerables);

export const PlotFigure = ({options, width, height}: {options: any, width?: string | number, height?: string | number}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();
  useEffect(() => {  // TODO: FIX CANVAS ALREADY IN USE BUG
    if (!ref.current) return;
    chart?.destroy();
    setChart(new Chart(ref.current, options));
    // eslint-disable-next-line
  }, [options]);
  return (<canvas width={width} height={height} ref={ref} id={Date.now() + "" + Math.random()}></canvas>);
};
