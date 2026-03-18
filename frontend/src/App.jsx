import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      setError("Failed to load tasks. Please check your connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchTodos();
      return;
    }

    try {
      const res = await axios.get(`${API}/api/todos/search?q=${query}`);
      setTodos(res.data);
    } catch (err) {
      setError("Search failed.");
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setError("");
    try {
      const res = await axios.post(`${API}/api/todos`, { text: newTodo.trim() });
      setTodos([...todos, res.data]);
      setNewTodo("");
    } catch (err) {
      setError("Could not add task.");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    setError("");
    try {
      const res = await axios.patch(`${API}/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError("Could not update task.");
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editedText.trim()) return;
    setError("");
    try {
      const res = await axios.patch(`${API}/api/todos/${id}`, {
        text: editedText.trim(),
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch (err) {
      setError("Could not save changes.");
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    try {
      await axios.delete(`${API}/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Task Manager
        </h1>

        {/* Add task form */}
        <form
          onSubmit={addTodo}
          className="flex gap-2 mb-4"
        >
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none text-gray-700"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add
          </button>
        </form>

        {/* Search bar */}
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-700 mb-4"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search tasks..."
        />

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Loading state */}
        {loading && (
          <p className="text-gray-400 text-center">Loading tasks...</p>
        )}

        {/* Empty state */}
        {!loading && todos.length === 0 && (
          <p className="text-gray-400 text-center mt-6">No tasks yet. Add one above!</p>
        )}

        {/* Todo list */}
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <div key={todo._id}>
              {editingId === todo._id ? (
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none text-gray-700"
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <MdOutlineDone />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <IoClose />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => toggleTodo(todo._id)}
                      className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {todo.completed && <MdOutlineDone size={14} />}
                    </button>
                    <span
                      className={`truncate font-medium ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <MdModeEditOutline />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
