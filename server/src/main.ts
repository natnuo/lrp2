import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path";
import * as fs from 'fs';
import { parse } from 'fast-csv';

const PORT = 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, `../../client/build`, "index.html"));
});

const CNTODN = {
  colleges_applied_to: "Colleges Applied To",
  correct_math_questions: "Correct Math Questions",
  daily_exercise_minutes: "Daily Exercise Minutes",
  exam_study_hours: "Exam Study Hours",
  hand_size: "Hand Size (in)",
  height: "Height (in)",
  instagram_followers: "Instagram Followers",
  knee_to_floor_distance: "Knee to Floor Distance (in)",
  shoe_size: "Shoe Size (US Male)",
  snapchat_streaks: "Snapchat Streaks",
  weekly_homework_hours: "Weekly Homework Hours",
  weekly_job_work_hours: "Weekly Job-Work Hours",
  wingspan: "Wingspan (in)",
};

// TODO: HANDLE DATA REQUESTS, CHECK FORMAT IN App.tsx
app.post("/api/gd/:x/:y", (req, res) => {
  const xaxis = req.params.x;
  const yaxes = new Set(req.params.y.split(","));

  let data: {[key: string]: any} = {};

  fs.createReadStream("data/data.csv")
    .pipe(parse({ headers: true }))
    .on("error", (error) => { console.error(error); })
    .on("data", (row) => {
      for (let key of Object.keys(row)) {
        if (!yaxes.has(key)) continue;
        data[CNTODN[key as keyof typeof CNTODN]] = [
          ...data[CNTODN[key as keyof typeof CNTODN]]??[],
          {
            x: row[xaxis],
            y: row[key]??0,
          },
        ];
      }
    })
    .on("end", () => {
      let dbt = [];
      let i=0;
      const colors = ["#f88", "#ff8", "#8f8", "#8ff", "#88f", "#f8f", "#f55", "#ff5", "#5f5", "5ff", "55f", "f5f"];
      for (let [key, value] of Object.entries(data)) {
        dbt.push({
          label: key,
          data: value,
          backgroundColor: colors[i++],
        });
      }
      res.send(dbt);
    });
});

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
