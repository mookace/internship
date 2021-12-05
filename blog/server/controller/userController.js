const mongoose = require('mongoose')
const user = require('../model/user')
const joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SALT_ROUND = 10
const SECRET_KEY = 'this is secret key asdfghjkl'


const signup = async (req, res) => {
    let { name, email, password, comformpassword } = req.body

    const schema = joi.object({
        password: joi.string()
            .min(4)
            .max(30)
            .required(),
        email: joi.any(),
        comformpassword: joi.any(),
        name: joi.any(),

    });

    try {
        const validationErr = schema.validate(req.body, { abortEarly: false });
        if (validationErr && validationErr.error) {
            let message = validationErr.error.details.map(dat => {
                return dat.message;
            });
            return res.status(422).json({
                message
            });
        }
        if (password !== comformpassword) {
            return res.status(401).json({
                message: 'Password Must Be Same'
            })
        }
        email = email.toLowerCase()
        let olduser = await user.find({ email })
        if (olduser.length > 0) {
            return res.status(422).json({
                message: 'Email Already Exist'
            })
        }
        let hash = bcrypt.hashSync(password, SALT_ROUND)
        console.log(hash)
        let newUser = user({
            name,
            email,
            password: hash
        })
        let result = await newUser.save()
        res.status(200).json({
            status: 'OK',
            newUser: result
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }



}

const login = async (req, res) => {
    let { email, password } = req.body
    let currentuser = await user.findOne({ email })
    if (currentuser == null) {
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }

    let comparepassword = bcrypt.compareSync(password, currentuser.password)
    if (!comparepassword) {
        return res.status(401).json({
            message: 'Invalid Password'
        })
    }
    let { _id, name } = currentuser
    let token = jwt.sign({
        _id,
        email,
        name
    }, SECRET_KEY, { expiresIn: '48h' })
    res.status(200).json({
        token
    })
}
module.exports = { signup, login }