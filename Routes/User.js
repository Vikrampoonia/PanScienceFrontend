// src/routes/userRoutes.js
import express from "express";
import { createUser, getUsers, getUserById, updateUserRole, deleteUser } from "../Controllers/User.js";
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
