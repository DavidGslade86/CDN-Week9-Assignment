const express = require('express');
const router = express.Router();

const {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    getListTasks,
    deleteTask
} = require('../controllers/tasks');

router.route('/').post(createTask).get(getAllTasks);
router.route('/:id').get(getTask).delete(deleteTask).patch(updateTask);
router.route('/list/:listId').get(getListTasks);

module.exports = router;