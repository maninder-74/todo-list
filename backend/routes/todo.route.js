import express from "express";
import {
  getTodos,
  searchTodosController,
  addTodo,
  editTodo,
  removeTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/search", searchTodosController);
router.post("/", addTodo);
router.patch("/:id", editTodo);
router.delete("/:id", removeTodo);

export default router;
