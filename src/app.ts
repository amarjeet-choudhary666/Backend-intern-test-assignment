import express from "express";
import cookieParser from "cookie-parser";
import leadsRouter from "./routes/leads.routes";
import tagsRouter from "./routes/tags.routes";
import tasksRouter from "./routes/tasks.routes";
import { ApiError } from "./utils/apiError";

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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
});

export  {app};
