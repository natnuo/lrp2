import React, { useCallback, useReducer, useState } from "react";
import styles from "../css/index.module.css";
import { DataColumnDisplay } from "./dcdisp";
import * as Plot from "@observablehq/plot";
import { PlotFigure } from "./PlotFigure";

export interface DataColumn {
  display_name: string,
  code_name: string,
  active: boolean,
};

export interface ResData {
  display_name: string,
  y: number,
  x: number
};

const App = () => {
  const [xAxis, setXAxis] = useState({ display_name: "Correct Math Questions", code_name: "correct_math_questions", active: true } as DataColumn);
  const [yAxes, updateYAxes] = useReducer((state: DataColumn[], { code_name_remove, dc_add }: { code_name_remove: string, dc_add: DataColumn }) => {
    state = state.filter((vv) => { return vv.code_name !== code_name_remove; });
    state.push(dc_add);
    state.sort((a, b) => { return a.display_name.localeCompare(b.display_name); });
    return state;
  }, [
    { display_name: "Colleges Applied To", code_name: "colleges_applied_to", active: false },
    { display_name: "Daily Exercise Minutes", code_name: "daily_exercise_minutes", active: false },
    { display_name: "Exam Study Hours", code_name: "exam_study_hours", active: false },
    { display_name: "Height (in)", code_name: "height", active: false },
    { display_name: "Instagram Followers", code_name: "instagram_followers", active: false },
    { display_name: "Knee to Floor Distance (in)", code_name: "knee_to_floor_distance", active: false },
    { display_name: "Shoe Size (US Male)", code_name: "shoe_size", active: false },
    { display_name: "Snapchat Streaks", code_name: "snapchat_streaks", active: true },
    { display_name: "Weekly Homework Hours", code_name: "weekly_homework_hours", active: false },
    { display_name: "Weekly Work Hours", code_name: "weekly_work_hours", active: false },
    { display_name: "Wingspan (in)", code_name: "wingspan", active: false },
  ]);

  // crazy naming convention standardization right here ong
  const swapToX = useCallback((dataColumn: DataColumn) => {
    updateYAxes({ code_name_remove: dataColumn.code_name, dc_add: xAxis });
    setXAxis({ ...dataColumn, active: true });
  }, [xAxis]);

  const toggleActiveness = useCallback((dataColumn: DataColumn) => {
    updateYAxes({ code_name_remove: dataColumn.code_name, dc_add: { ...dataColumn, active: !dataColumn.active } });
  }, []);

  const [data, setData] = useState([] as ResData[]);

  return (
    <div className={`${styles["w-svw"]} ${styles["h-svh"]} ${styles["flex"]} ${styles["align-center"]} ${styles["justify-center"]}`}>
      <div className={`${styles["border"]} ${styles["border-gray-300"]} ${styles["rounded"]} ${styles["flex-grow"]} ${styles["m-32"]} ${styles["p-4"]} ${styles["gap-4"]} ${styles["flex"]}`}>
        <div className={`${styles["h-full"]} ${styles["w-64"]} ${styles["gap-4"]} ${styles["flex"]} ${styles["flex-col"]}`}>
          <h2 className={`${styles["font-semibold"]}`}>X-Axis</h2>
          <DataColumnDisplay data_column_obj={xAxis}></DataColumnDisplay>
          <hr className={`${styles["border-gray-300"]}`} />
          <h2 className={`${styles["font-semibold"]}`}>Y-Axis</h2>
          {
            yAxes.map((dc) => {
              return (<DataColumnDisplay data_column_obj={dc} swapToX={swapToX} toggleActiveness={toggleActiveness} key={dc.code_name}></DataColumnDisplay>)
            })
          }
        </div>
        <div>
          <PlotFigure
            options={{
              color: {legend: true},
              marks: [
                Plot.dot(data, {x:"x",y:"y",stroke:"display_name"})
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
