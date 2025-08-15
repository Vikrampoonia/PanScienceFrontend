// src/controllers/taskController.js
import pool from "../config/db.js";
import { uploadFile, deleteFile } from "../config/s3.js";

export const createTask = async (req, res) => {
  try {
    let attachments = [];
    if (req.files) {
      const uploaded = await Promise.all(req.files.map(file => uploadFile(file)));
      attachments = uploaded.map(f => f.Location); // Store S3 URL
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, dueDate, assignedTo, attachments) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, status, priority, dueDate, assignedTo, attachments]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasks = async (_, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
  res.json(result.rows[0]);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  let attachments = req.body.attachments || [];
  if (req.files) {
    const uploaded = await Promise.all(req.files.map(file => uploadFile(file)));
    attachments = [...attachments, ...uploaded.map(f => f.Location)];
  }

  const result = await pool.query(
    `UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, dueDate=$5, assignedTo=$6, attachments=$7 WHERE id=$8 RETURNING *`,
    [title, description, status, priority, dueDate, assignedTo, attachments, id]
  );

  res.json(result.rows[0]);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await pool.query("SELECT attachments FROM tasks WHERE id=$1", [id]);

  // Delete files from S3
  if (task.rows[0]?.attachments) {
    await Promise.all(
      task.rows[0].attachments.map(url => {
        const key = url.split(".amazonaws.com/")[1];
        return deleteFile(key);
      })
    );
  }

  await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
  res.json({ message: "Task deleted" });
};
