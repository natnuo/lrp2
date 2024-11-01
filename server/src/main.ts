import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path";
import * as fs from "fs";
import { parse } from "fast-csv";
import https from "node:https";

const SSL_KEY = fs.readFileSync(process.env.SSL_KEY ?? path.resolve(__dirname, "../key.pem"));
const SSL_CERT = fs.readFileSync(process.env.SSL_CERT ?? path.resolve(__dirname, "../cert.pem"));
const PORT = process.env.PORT ?? 3001;

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

app.post("/api/gd/:isResidual/:x/:y", (req, res) => {
  const isResidual = req.params.isResidual === "1";
  const xaxis = req.params.x;
  const yaxes = new Set(req.params.y.split(","));

  let data: {[key: string]: any} = {};

  fs.createReadStream("data/data.csv")
    .pipe(parse({ headers: true }))
    .on("error", (error) => { console.error(error); })
    .on("data", (row) => {
      for (let key of Object.keys(row)) {
        if (!yaxes.has(key) || !row[key] || row[key] === "0" || !row[xaxis] || row[xaxis] === "0") continue;
        data[CNTODN[key as keyof typeof CNTODN]] = [
          ...data[CNTODN[key as keyof typeof CNTODN]]??[],
          {
            x: parseFloat(row[xaxis]),
            y: parseFloat(row[key]),
          },
        ];
      }
    })
    .on("end", () => {
      let dbt = [];
      let i=0;
      const colors = ["#f88", "#88f", "#5f5", "#ff5", "#f5f", "#5ff", "#f55", "#5f5", "#55f", "#f22", "#22f", "#1f1", "#ff2", "#f2f", "#2ff"];
      for (let [key, value] of Object.entries(data)) {
        let smx=0, smy=0;
        // console.log(value);
        for (let point of value) {
          smx += point.x;
          smy += point.y;
        }

        const n = value.length;

        const xbar = smx/n, ybar = smy/n;

        let smdx=0, smdy=0;
        let mxx=Number.NEGATIVE_INFINITY, mnx=Infinity;
        for (let point of value) {
          smdx += Math.pow(point.x - xbar, 2);
          smdy += Math.pow(point.y - ybar, 2);
          mxx = Math.max(point.x, mxx);
          mnx = Math.min(point.x, mnx);
        }

        const sx = Math.sqrt(smdx / n-1), sy = Math.sqrt(smdy / n-1);

        // console.log(smx, smy, xbar, ybar, sx, sy);

        let smxyp = 0;
        for (let point of value) {
          smxyp += (point.x - xbar) * (point.y - ybar);
        }

        const r = ((1/(n*sx*sy))*smxyp)

        const b1 = r*sy/sx;
        const b0 = ybar - b1 * xbar;

        let regression = [];
        for (let x=mnx-10;x<mxx+10;x+=10) {
          regression.push({
            x: x,
            y: b1*x+b0,
          });
        }

        if (!isResidual) {
          dbt.push({
            label: key,
            data: value,
            backgroundColor: colors[i],
          });
          dbt.push({
            label: `Best Fit Line (${key})`,
            data: regression,
            borderColor: colors[i++] + "8",
            backgroundColor: "transparent",
            type: "line",
          });
        } else {
          dbt.push({
            label: key,
            data: value.map((vv: any) => {
              return {
                x: vv.x,
                y: vv.y - (b1*vv.x+b0),
              }
            }),
            backgroundColor: colors[i++],
          })
        }
      }
      res.send(dbt);
    });
});

https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app).listen(PORT, () => {
  console.log("App listening on port", PORT);
});
