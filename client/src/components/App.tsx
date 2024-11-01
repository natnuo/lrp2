import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import styles from "../css/index.module.css";
import { DataColumnDisplay } from "./dcdisp";
import { PlotFigure } from "./PlotFigure";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export interface DataColumn {
  display_name: string,
  code_name: string,
  active: boolean,
};

// export interface ResData {
//   display_name: string,
//   y: number,
//   x: number
// };

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
    // { display_name: "Hand Size (in)", code_name: "hand_size", active: false },
    { display_name: "Height (in)", code_name: "height", active: false },
    { display_name: "Instagram Followers", code_name: "instagram_followers", active: false },
    { display_name: "Knee to Floor Distance (in)", code_name: "knee_to_floor_distance", active: false },
    { display_name: "Shoe Size (US Male)", code_name: "shoe_size", active: false },
    { display_name: "Snapchat Streaks", code_name: "snapchat_streaks", active: true },
    { display_name: "Weekly Homework Hours", code_name: "weekly_homework_hours", active: false },
    { display_name: "Weekly Job-Work Hours", code_name: "weekly_job_work_hours", active: false },
    { display_name: "Wingspan (in)", code_name: "wingspan", active: false },
  ]);

  // crazy naming convention standardization right here ong
  const validDeact = useCallback((dataColumn: DataColumn) => {
    const actv = yAxes.filter((vv) => { return vv.active && vv.code_name !== dataColumn.code_name; });
    return actv.length > 0;
  }, [yAxes]);

  const swapToX = useCallback((dataColumn: DataColumn) => {
    // if (!validDeact(dataColumn)) return;
    updateYAxes({ code_name_remove: dataColumn.code_name, dc_add: xAxis });
    setXAxis({ ...dataColumn, active: true });
  }, [xAxis]);

  const toggleActiveness = useCallback((dataColumn: DataColumn) => {
    if (!validDeact(dataColumn)) return;
    updateYAxes({ code_name_remove: dataColumn.code_name, dc_add: { ...dataColumn, active: !dataColumn.active } });
  }, [validDeact]);

  const [data, setData] = useState<any>();
  const [title, setTitle] = useState<string>();
  const [isResidual, setIsResidual] = useState(false);
  useEffect(() => {
    fetch(`api/gd/${isResidual ? 1 : 0}/${xAxis.code_name}/${yAxes.filter((vv) => { return vv.active }).map((vv) => { return vv.code_name; }).join(",")}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (res) => {
      const json = await res.json();
      setData(json.data);
      setTitle(json.title);
    });
  }, [xAxis, yAxes, isResidual]);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const plotContRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles["w-svw"]} ${styles["h-svh"]} ${styles["flex"]} ${styles["align-center"]} ${styles["justify-center"]} ${styles["pattern-diagonal-stripes-lg"]}`} style={{ color: "#fff8ff" }}>
      <div className={`${styles["border"]} ${styles["border-purple-300"]} ${styles["bg-gradient-to-tr"]} ${styles["from-slate-50"]} ${styles["via-white"]} ${styles["to-white"]} ${styles["text-black"]} ${styles["rounded-lg"]} ${styles["flex-grow"]} ${styles["m-16"]} ${styles["p-4"]} ${styles["gap-4"]} ${styles["flex"]}`} style={{ maxWidth: "1200px", maxHeight: "700px", filter: "drop-shadow(0 0 10px #ffe5ff)" }}>
        <div className={`${styles["h-full"]} ${styles["w-64"]} ${styles["gap-2"]} ${styles["flex"]} ${styles["flex-col"]} ${styles["overflow-y-scroll"]} ${styles["pr-4"]}`}>
          <button className={`${styles["w-full"]} ${styles["bg-purple-800"]} ${styles["text-slate-100"]} ${styles["font-bold"]} ${styles["rounded-lg"]} ${styles["p-2"]} ${styles["pointer"]} ${styles["transition-all"]} ${styles["duration-300"]} ${styles["bg-gradient-to-tr"]} ${styles["from-purple-900"]} ${styles["to-purple-800"]} ${styles["hover:brightness-125"]}`} onClick={() => { setIsResidual(!isResidual); }}>
            {
              !isResidual
              ? "Make Residual Plot"
              : <div>
                Make The Other Plot
                <span className={`${styles["font-normal"]} ${styles["text-slate-300"]} ${styles["block"]}`} style={{ fontSize: "0.55rem" }}>(whatever it's called)</span>
              </div>
            }
          </button>
          <hr className={`${styles["border-gray-300"]}`} />
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
        <div className={`${styles["flex-grow"]} ${styles["flex"]} ${styles["flex-col"]}`}>
          <div className={`${styles["flex"]} ${styles["justify-between"]} ${styles["px-4"]} ${styles["items-center"]} ${styles["mb-4"]}`}>
            <div className={`${styles["flex"]} ${styles["flex-col"]} ${styles["gap-2"]}`}>
              <a href="https://github.com/natnuo/lrp2" rel="noreferrer" target="_blank" className={`${styles["text-2xl"]} ${styles["transition-all"]} ${styles["hover:text-pink-700"]} ${styles["font-semibold"]} ${styles["leading-3"]} ${styles["mt-2"]}`}>Linear Regression Project!</a>
              <span className={`${styles["text-sm"]} ${styles["text-gray-500"]}`}>Nathan Tao</span>
            </div>
            <div className={`${styles["flex"]} ${styles["gap-1"]} ${styles["w-20"]} ${styles["flex-wrap"]}`}>
              <div className={`${styles["flex"]} ${styles["justify-center"]} ${styles["items-center"]}`} style={{ borderRadius: "4.5px", backgroundColor: "#242938", width: "20px" }} title="Made with Chart.js">
                <img src="https://www.chartjs.org/docs/latest/favicon.ico" style={{ width: "69%", height: "69%" }} alt="Made with Chart.js"></img>
              </div>
              <img className={`${styles["h-5"]}`} src="https://camo.githubusercontent.com/eed59029fe16e0f33431721522fb0eede534a072db478245b89b6bc4ab1b10f3/68747470733a2f2f736b696c6c69636f6e732e6465762f69636f6e733f693d65787072657373" alt="Made with Express.js" title="Made with Express.js"></img>
              <img className={`${styles["h-5"]}`} src="https://camo.githubusercontent.com/c0ed7f7d36d6437790846bc99e238abd7cb2205dbec27c6e6be959abb04e2733/68747470733a2f2f736b696c6c69636f6e732e6465762f69636f6e733f693d6e6f64656a73" alt="Made with Node.js" title="Made with Node.js"></img>
              <img className={`${styles["h-5"]}`} src="https://camo.githubusercontent.com/cb1fa2738a401d7952e8c150707084c5336ba9d544a238fad8c8d4d942353d8a/68747470733a2f2f736b696c6c69636f6e732e6465762f69636f6e733f693d7265616374" alt="Made with React.js" title="Made with React.js"></img>
              <img className={`${styles["h-5"]}`} src="https://raw.githubusercontent.com/tandpfun/skill-icons/65dea6c4eaca7da319e552c09f4cf5a9a8dab2c8/icons/TailwindCSS-Dark.svg" alt="Made with Tailwind.css" title="Made with Tailwind.css"></img>
              <img className={`${styles["h-5"]}`} src="https://camo.githubusercontent.com/ea3a367c6ef785b5447cba5462d868ffed003c813a1c2e0d5aed924fc0a7fcda/68747470733a2f2f736b696c6c69636f6e732e6465762f69636f6e733f693d7473" alt="Made with Typescript" title="Made with Typescript"></img>
            </div>
          </div>
          <div ref={plotContRef} className={`${styles["flex-grow"]}`}>
            <PlotFigure
              options={{
                type: "scatter",
                data: {
                  datasets: data,
                },
                options: {
                  plugins: {
                    title: {
                      display: true,
                      text: title,
                    }
                  },
                  scales: {
                    x: {
                      type: "linear",
                      position: "bottom",
                      title: {
                        text: xAxis.display_name,
                        display: true,
                      }
                    }
                  }
                }
              }}
              width={plotContRef.current?.scrollWidth}
              height={plotContRef.current?.scrollHeight ? plotContRef.current.scrollHeight - 200 : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
