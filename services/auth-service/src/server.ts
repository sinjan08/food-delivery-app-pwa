import swaggerSpec from "@/docs/swagger";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = express();
const version = env.VERSION;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(env.APP_NAME + " Running 🚀");
});

app.use(`/api/v${version}/auth`, authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs-json", (req, res) => res.json(swaggerSpec));

app.listen(env.PORT, () => console.log(env.APP_NAME + " running on port", env.PORT));
