const {StatusCodes} = require('http-status-codes')
const Task = require('../models/Tasks')
const {BadRequestError, NotFoundError} = require('../errors');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({success:true, data:{tasks, count: tasks.length }});
}

const getListTasks = async (req, res) => {
    const listId = req.params.listId; 
    const tasks = await Task.find({
        createdBy: req.user.userId, 
        listIds: listId
    }).sort('createdAt');

    res.status(StatusCodes.OK).json({success:true, data:{tasks, count: tasks.length }});
}

const getTask = async (req, res) => {
    const {user:{userId}, params: {id: taskId}} = req; 
    const task = await Task.find({
        createdBy: userId, 
        _id: taskId,
    });
    if(!task) {
        throw new NotFoundError(`No task with id ${taskId} was found.`)
    }
    res.status(StatusCodes.OK).json({ task });
}

const createTask = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const task = await Task.create(req.body);
    res.status(StatusCodes.CREATED).json({success:true, data: task});
}

const updateTask = async (req, res) => {

    const {
        body,
        user:{userId},
        params: {id: taskId}
    } = req;

    if(Object.keys(body).length === 0) {
        throw new BadRequestError(`At least one field must be changed for update to occur.`)
    }

    const task = await Task.findByIdAndUpdate(
        {
            createdBy: userId, 
            _id: taskId,
        },
        req.body,
        {
            new:true,
            runValidators:true
        },
    );

    if(!task) {
        throw new NotFoundError(`No task with id ${taskId} was found.`)
    }
    res.status(StatusCodes.OK).json({success:true, data: task});
}

const deleteTask = async (req, res) => {
    const {
        user:{userId},
        params: {id: taskId}
    } = req; 

    const task = await Task.findOneAndRemove({
        createdBy: userId, 
        _id: taskId,
    });

    if(!task) {
        throw new NotFoundError(`No task with id ${taskId} was found.`)
    }

    res.status(StatusCodes.OK).json({success:true, message:`Task with id ${taskId} was removed`});
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    getListTasks,
    deleteTask,
}