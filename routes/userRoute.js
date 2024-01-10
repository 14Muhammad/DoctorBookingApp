const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({email: req.body.email});
        if(userExists){
            return res.status(400).send({message: 'User already exists', success: false});
        }
        const password = req.body.password;
        const salt = await(bcrypt.genSalt(10));
        const encryptedPassword = await(bcrypt.hash(password, salt));
        req.body.password = encryptedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({message: 'User created successfully', success: true});
    } catch (e) {
         res.status(500).send({message: 'Error creating user', success: false, e});
    }
})
router.post('/login', async (req, res) => {
    try {

    } catch (e) {
    }
})
module.exports = router;
