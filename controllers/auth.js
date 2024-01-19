const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req, res, next) => {
    try{
        const user = await User.create({...req.body});
        const token = user.createJWT();

        const cookiesOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        };
        res.cookie("authToken", token, cookiesOptions);
        res.status(StatusCodes.CREATED).json({
            success:true,
            message:`Welcome ${user.name}! Thanks for creating an account!`,
            name:{name:user.name}
    })
    } catch(error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email||!password) {
            throw new BadRequestError('Please provide an email and password.')
        }

        const user = await User.findOne({email})
        if(!user) {
            throw new UnauthenticatedError(`Can't find a user with that email.`);
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if(! isPasswordCorrect) {
            throw new UnauthenticatedError(`That email/password combination doesn't match.`);
        }
        const token = user.createJWT();
        const cookiesOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        };
        res.cookie("authToken", token, cookiesOptions);
        res.status(StatusCodes.OK).json({
            success:true,
            message:"User successfully logged in!"
        })
    } catch(error) {
        next(error);
    }
};

module.exports = {
    register,
    login
}