const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  bulkDeleteTasks,
  getTaskStats,
} = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validators');

router.get('/stats', getTaskStats);

// CRUD routes
router.route('/')
  .get(getAllTasks)         
  .post(validateCreateTask, createTask)  
router.route('/:id')
  .get(getTaskById)                    
  .put(validateUpdateTask, updateTask)   
  .patch(patchTask)                     
  .delete(deleteTask);              

module.exports = router;
