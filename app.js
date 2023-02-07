require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const User = require("./model/user");
const Result = require("./model/result");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");
const cors = require('cors');
const app = express();

app.use(express.json());

module.exports = app;

app.post("/register", cors(), async (req, res) => {
    let encryptedPassword;
    try {
        const {first_name, last_name, email, password} = req.body;

        if (!(email && password && first_name && last_name)) {
            return res.status(409).send({'error': 'error.allFieldRequired'});
        }

        const oldUser = await User.findOne({email});

        if (oldUser) {
            return res.status(409).send({'error': 'error.userExist'});
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        return res.status(200).json('success');
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", cors(), async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!(email && password)) {
            return res.status(409).send({'error': 'error.allFieldRequired'});
        }

        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            const responseUser = {
                id: user._id,
                fName: user.first_name,
                lName: user.last_name,
                email: user.email,
            }
            responseUser.token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: parseInt(process.env.TOKEN_EXPIRE) + "h",
                }
            );
            responseUser.expire = process.env.TOKEN_EXPIRE
            res.status(200).json(responseUser);
        } else {
            return res.status(403).send({'error': 'error.invalidCredential'});
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/userData", cors(), auth, async (req, res) => {
    const email = req.user.email
    const user = await User.findOne({ email })
    const usersStats = await Result.find({ email })

    const output = usersStats.map(result => {
        let copyOfResult = JSON.stringify(result)
        let tmp = JSON.parse(copyOfResult)
        tmp.fullName = `${user.first_name} ${user.last_name}`
        return tmp
    })

    res.status(200).send(JSON.stringify(output));
});

app.post("/saveUserResult", cors(), auth, async (req, res) => {
    const email = req.user.email
    const user = await User.findOne({email});

    if (!user) {
        return res.status(409).send({'error': 'error.userNotFound'});
    }

    try {
        const {result_time, correct_input, incorrect_input, percent, text, timer, timer_percent} = req.body;

        if (!(result_time && correct_input && incorrect_input && percent && text)) {
            return res.status(409).send({'error': 'error.allFieldRequired'});
        }

        await Result.create({
            email: user.email,
            result_time,
            correct_input,
            incorrect_input,
            percent,
            text,
            timer,
            timer_percent
        });
        res.status(200).send({'message': `saved`});
    } catch (err) {
        console.log(err);
    }
});
