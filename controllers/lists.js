const {StatusCodes} = require('http-status-codes')
const List = require('../models/Lists')
const {BadRequestError, NotFoundError} = require('../errors');

const getAllLists = async (req, res) => {
    const lists = await List.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({lists, count: lists.length});
}
const getList = async (req, res) => {
    res.send('get task');
}

const createList = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const list = await List.create(req.body);
    res.status(StatusCodes.CREATED).json({ list });
}

const updateList = async (req, res) => {
    res.send('update task');
}
const deleteList = async (req, res) => {
    res.send('delete task');
}

module.exports = {
    getAllLists,
    getList,
    createList,
    updateList,
    deleteList,
}