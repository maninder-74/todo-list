import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
   origin: "https://preeminent-moonbeam-0f6696.netlify.app"
}));

app.use("/api/todos", todoRoutes);

const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
  // app.use(express.static(path.join(__dirname, "/frontend/dist")));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  // });
// }

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
