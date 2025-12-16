import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes";
dotenv.config();

const version = process.env.API_VERSION

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(`/api/v${version}`, authRoutes);
app.use("/api/v${version}/api-gateway/test", (req, res) => res.send("API Gateway is working"));

app.listen(4000, () => {
  console.log("API Gateway is running on port 4000");
});