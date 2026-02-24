import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

app.use("/api/v1", routes);


export default app;
