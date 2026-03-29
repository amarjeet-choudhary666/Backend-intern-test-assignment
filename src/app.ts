import express from "express";
import cookieParser from "cookie-parser";
import leadsRouter from "./routes/leads.routes";
import tagsRouter from "./routes/tags.routes";
import tasksRouter from "./routes/tasks.routes";

const app = express();

app.use(express.json({limit: "10kb"}))
app.use(express.urlencoded({extended: true, limit: "10kb"}))
app.use(cookieParser())

app.use("/api/leads", leadsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/tasks", tasksRouter);


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SynQ CRM API is running",
    timestamp: new Date().toISOString(),
  });
});

export  {app};
