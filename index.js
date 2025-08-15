// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/User.js";
import taskRoutes from "./Routes/Task.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
