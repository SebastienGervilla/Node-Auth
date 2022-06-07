const express = require('express');
const router = express.Router();

const { signup, signin, signout } = require('../controllers/userController');
const { check } = require('express-validator');

router.post('/signup', [
    check("name", "Name should be atleast 3 characters.").isLength({min: 3}),
    check("lastname", "Last name should be atleast 2 characters.").isLength({min: 2}),
    check("email", "Invalid email.").isEmail(),
    check("password", "Password should be atleast 8 characters.").isLength({min: 8}),
], signup);

router.post('/signin', signin);

router.get('/signout', signout)

module.exports = router