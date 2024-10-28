import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path";

const PORT = 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, `../../client/build`, "index.html"));
});

// TODO: HANDLE DATA REQUESTS, CHECK FORMAT IN App.tsx
app.post("/api/")

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
