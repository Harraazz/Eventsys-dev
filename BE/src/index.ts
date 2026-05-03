import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});