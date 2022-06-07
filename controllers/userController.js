const UserModel = require('../models/userModel');
const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) 
        return res.status(400).json({
            error: errors.array()[0].msg
        });

    const NewUser = new UserModel(req.body);
    NewUser.save((error, user) => {
        if (error) 
            return res.status(400).json({
                error: "Unable to add user: " + user
            });
        
        return res.json({
            message: "Successfully registered.", 
            user
        });
    });
}

exports.signin = (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({email}, (error, user) => {
        if (error || !user)
            return res.status(400).json({
                error: "User not found"
            });

        if (!user.authenticate(password))
            return res.status(400).json({
                error: "Email and password do not match"
            });

        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        res.cookie('token', token, {expire: new Date() + 1});

        const { _id, name, email } = user
        return res.json({
            token,
            user : {
                _id,
                name,
                email
            }
        });
    });
}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "Successfully signed out"
    });
}