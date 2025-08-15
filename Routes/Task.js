// src/routes/taskRoutes.js
import express from "express";
import upload from "../middlewares/upload.js";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../Controller/Task.js";

const router = express.Router();

router.post("/", upload.array("attachments", 3), createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", upload.array("attachments", 3), updateTask);
router.delete("/:id", deleteTask);

export default router;
