const {StatusCodes} = require('http-status-codes')
const List = require('../models/Lists')
const {BadRequestError, NotFoundError} = require('../errors');

const getAllLists = async (req, res) => {
    const lists = await List.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({lists, count: lists.length});
}

const getList = async (req, res) => {
    const {user:{userId}, params: {id: listId}} = req; 
    const list = await List.find({
        createdBy: userId, 
        _id: listId,
    });
    if(!list) {
        throw new NotFoundError(`No list with id ${listId} was found.`)
    }
    res.status(StatusCodes.OK).json({ list });
}

const createList = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const list = await List.create(req.body);
    res.status(StatusCodes.CREATED).json({ list });
}

const updateList = async (req, res) => {
    const {
        body,
        user:{userId},
        params: {id: listId}
    } = req;

    if(Object.keys(body).length === 0) {
        throw new BadRequestError(`At least one field must be changed for update to occur.`)
    }

    const list = await List.findByIdAndUpdate(
        {
            createdBy: userId, 
            _id: listId,
        },
        req.body,
        {
            new:true,
            runValidators:true
        },
    );

    if(!list) {
        throw new NotFoundError(`No task with id ${listId} was found.`)
    }
    res.status(StatusCodes.OK).json({success:true, data: list});
}

const deleteList = async (req, res) => {
    const {
        user:{userId},
        params: {id: listId}
    } = req; 

    const list = await List.findOneAndRemove({
        createdBy: userId, 
        _id: listId,
    });

    if(!list) {
        throw new NotFoundError(`No task with id ${listId} was found.`)
    }

    res.status(StatusCodes.OK).json({success:true, message:`List with id ${listId} was removed`});
}

module.exports = {
    getAllLists,
    getList,
    createList,
    updateList,
    deleteList,
}