import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(env.APP_NAME + " Running 🚀");
});

app.use("/auth", authRoutes);


app.listen(env.PORT, () => console.log(env.APP_NAME + " running on port", env.PORT));
