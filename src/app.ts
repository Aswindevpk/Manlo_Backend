import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import { globalLimiter } from "./common/middleware/rate-limit.middleware";

const app = express();

app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use(globalLimiter);

app.use("/api/v1", routes);



export default app;
