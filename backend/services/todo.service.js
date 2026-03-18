import Todo from "../models/todo.model.js";

// get every todo from DB
const getAllTodos = async () => {
  const todos = await Todo.find();
  return todos;
};

// search todos by keyword in text field
const searchTodos = async (keyword) => {
  const todos = await Todo.find({
    text: { $regex: keyword, $options: "i" },
  });
  return todos;
};

// create a new todo
const createTodo = async (text) => {
  const todo = new Todo({ text });
  const saved = await todo.save();
  return saved;
};

// update text or completed status
const updateTodo = async (id, updates) => {
  const todo = await Todo.findById(id);
  if (!todo) return null;

  if (updates.text !== undefined) todo.text = updates.text;
  if (updates.completed !== undefined) todo.completed = updates.completed;

  const updated = await todo.save();
  return updated;
};

// delete a todo by id
const deleteTodo = async (id) => {
  const todo = await Todo.findById(id);
  if (!todo) return null;

  await Todo.findByIdAndDelete(id);
  return todo;
};

export { getAllTodos, searchTodos, createTodo, updateTodo, deleteTodo };
