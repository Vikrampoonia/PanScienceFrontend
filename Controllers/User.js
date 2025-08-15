// src/controllers/userController.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (_, res) => {
  const result = await pool.query("SELECT id, name, email, role, createdAt FROM users");
  res.json(result.rows);
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT id, name, email, role, createdAt FROM users WHERE id=$1", [id]);
  res.json(result.rows[0]);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await pool.query("UPDATE users SET role=$1 WHERE id=$2 RETURNING *", [role, id]);
  res.json(result.rows[0]);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
  res.json({ message: "User deleted" });
};
