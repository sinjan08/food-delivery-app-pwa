// import swaggerSpec from "@/docs/swagger";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import restaurantRoutes from "./routes/restaurant.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(env.APP_NAME + " Running 🚀");
});

app.use(`/restaurant`, restaurantRoutes);

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/docs-json", (req, res) => res.json(swaggerSpec));
app.get("/health", (_req, res) => {
  res.json({ status: "Restaurant service running" });
});
app.listen(env.PORT, () => console.log(env.APP_NAME + " running on port", env.PORT));
