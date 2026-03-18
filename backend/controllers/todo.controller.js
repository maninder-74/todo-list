import {
  getAllTodos,
  searchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todo.service.js";

const getTodos = async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const searchTodosController = async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) {
    return res.status(400).json({ message: "Please provide a search term" });
  }
  try {
    const results = await searchTodos(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

const addTodo = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text cannot be empty" });
  }

  try {
    const todo = await createTodo(text.trim());
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Could not create task" });
  }
};

const editTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updateTodo(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
};

const removeTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteTodo(id);
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete task" });
  }
};

export { getTodos, searchTodosController, addTodo, editTodo, removeTodo };
