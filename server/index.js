const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dbConnect();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const User = require('./models/User');
const Classroom = require('./models/Classroom');

const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`server is listening at http://localhost:${PORT}`);
})

app.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    const user = new User({
        email: trimmedEmail,
        password: trimmedPassword,
        role: trimmedRole
    });

    try {
        await user.save();
        res.status(200).send({
            message: `User ${trimmedEmail} created successfully`,
            user
        });
    } catch (error) {
        res.status(500).send({
            message: `Email not created`,
            error: error.message
        });
    }
});

app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    console.log(trimmedEmail, "email");

    try {
        const user = await User.findOne({ email: trimmedEmail });
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: 'User Not found' });
        }

        if (user.password !== trimmedPassword) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        return res.status(200).send({
            message: `User Present`,
        });
    } catch (error) {
        res.status(500).send({
            message: `Not verified`,
            error: error.message
        });
    }
});
