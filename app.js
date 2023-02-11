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
        const {startTime, endTime, length, errorChar, correctChar, currIndex, text, time} = req.body;

        if (!(text)) {
            return res.status(409).send({'error': 'error.allFieldRequired'});
        }

        const date = new Date();
        const dateStr =
            ("00" + date.getDate()).slice(-2)+ "." +
            ("00" + (date.getMonth() + 1)).slice(-2) + "." +
            date.getFullYear() + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);

        await Result.create({
            email: user.email,
            startTime,
            endTime,
            length,
            errorChar,
            correctChar,
            currIndex,
            text,
            time,
            date: dateStr
        });
        return res.status(200).send({'message': `saved`});
    } catch (err) {
        console.log(err);
    }
});

app.get("/getLeaders", cors(), async (req, res) => {
    const usersList = await User.find()

    if (!usersList) {
        return res.status(409).send({'error': 'error.noData'});
    }

    const promise = await usersList.map(async (user) => {
        const usersResults = await Result.find({ email: user.email })
        return usersResults.map((result) => {
            let copyOfResult = JSON.stringify(result)
            let tmp = JSON.parse(copyOfResult)
            tmp.fullName = `${user.first_name} ${user.last_name}`
            delete tmp.__v;
            return tmp;
        })
    })

    const output = await Promise.all(promise)

    await res.status(200).send(JSON.stringify(output.flat()));
});
