const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) {
        throw new UnauthenticatedError('Authentication error. Please login or create an account.');
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const {userId, userName} = payload;
        req.user = {userId, userName};
        next();
    } catch(error) {
        throw new UnauthenticatedError('Authentication error. Please login or create an account.');
    }
}

module.exports = auth;