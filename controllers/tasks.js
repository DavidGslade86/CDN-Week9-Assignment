const {StatusCodes} = require('http-status-codes')
const Task = require('../models/Tasks')
const {BadRequestError, NotFoundError} = require('../errors');

const getAllTasks = async (req, res) => {
    res.send('get all tasks');
}
const getTask = async (req, res) => {
    res.send('get task');
}

const createTask = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const task = await Task.create(req.body);
    res.status(StatusCodes.CREATED).json({ task });
}

const updateTask = async (req, res) => {
    res.send('update task');
}
const deleteTask = async (req, res) => {
    res.send('delete task');
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
}