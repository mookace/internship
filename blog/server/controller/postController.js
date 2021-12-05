const mongoose = require('mongoose')
const joi = require('@hapi/joi')
const post = require('../model/post')
const user = require('../model/user')
const { object } = require('@hapi/joi')


const getUserPosts = async (req, res) => {
    let { id } = req.params

    try {
        let result = await post.find({ createdBy: id }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 'ok',
            count: result.length,
            posts: result

        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })

    }

}


const getPosts = async (req, res) => {

    try {
        let result = await post.find().populate({ path: 'createdBy', select: 'name email', model: user }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 'ok',
            count: result.length,
            posts: result

        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })

    }

}


const getPost = async (req, res) => {
    try {
        let { id } = req.params
        let result = await post.findOne({ _id: id }).populate({ path: 'createdBy', select: 'name email', model: user });
        res.status(200).json({
            status: 'ok',
            posts: result

        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}



const createPosts = async (req, res) => {

    let data = req.body
    let { title, body } = data
    //image validation start
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'Must Attach a file' })
    }
    let files = req.files;
    // console.log(files)
    if (files.myfiles.truncated === true) {
        return res.status(400).json({
            message: 'File too large'
        })
    }
    if (
        !(
            files.myfiles.mimetype == 'image/png' ||
            files.myfiles.mimetype == 'image/jpeg'

        )
    ) {
        return res.status(400).json({
            message: 'only png and jpeg is allowed'
        })
    }

    files.myfiles.name == `${Date.now()}-${files.myfiles.name}`
    let filepath = `${appRoot}/public/${files.myfiles.name}`
    console.log(files)



    //image validation close
    const schema = joi.object({
        title: joi.string()
            .min(4)
            .max(100)
            .required(),
        body: joi.string()
            .min(5)
            .max(1000)
            .required()
    });

    try {
        const validationErr = schema.validate(data, { abortEarly: false });
        if (validationErr && validationErr.error) {
            let message = validationErr.error.details.map(dat => {
                return dat.message;
            });
            return res.status(422).json({
                message
            });
        }
        files.myfiles.mv(filepath, function (err) {
            if (err) return res.status(500).send(err);
            console.log('File uploaded')
        })
        data.imageurl = files.myfiles.name;

        data.createdAt = Date.now()
        data.createdBy = req.userData._id
        let newpost = post(data)
        let result = await newpost.save(data)
        res.status(200).json({
            status: 'ok',
            newpost: result
        })

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }


    res.send('Create new post')
}

const deletePosts = async (req, res) => {
    let { id } = req.params
    try {
        let result = await post.deleteOne({ _id: id, createdBy: req.userData._id });
        if (result.deletedCount === 0) {
            return res.status(400).json({
                message: 'Failed to delete'
            })
        }
        res.status(200).json({
            status: 'ok',
            posts: result

        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}

const updatePosts = async (req, res) => {
    let { id } = req.params

    let data = req.body
    let { title, body } = data
    //image validation start
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'Must Attach a file' })
    }
    let files = req.files;
    // console.log(files)
    if (files.myfiles.truncated === true) {
        return res.status(400).json({
            message: 'File too large'
        })
    }
    if (
        !(
            files.myfiles.mimetype == 'image/png' ||
            files.myfiles.mimetype == 'image/jpeg'

        )
    ) {
        return res.status(400).json({
            message: 'only png and jpeg is allowed'
        })
    }

    files.myfiles.name == `${Date.now()}-${files.myfiles.name}`
    let filepath = `${appRoot}/public/${files.myfiles.name}`
    console.log(files)



    //image validation close
    const schema = joi.object({
        title: joi.string()
            .min(4)
            .max(100)
            .required(),
        body: joi.string()
            .min(5)
            .max(1000)
            .required()
    });

    try {
        const validationErr = schema.validate(data, { abortEarly: false });
        if (validationErr && validationErr.error) {
            let message = validationErr.error.details.map(dat => {
                return dat.message;
            });
            return res.status(422).json({
                message
            });
        }
        files.myfiles.mv(filepath, function (err) {
            if (err) return res.status(500).send(err);
            console.log('File uploaded')
        })
        data.updatedAt = Date.now()
        data.imageurl = files.myfiles.name
        data.createdAt = Date.now()
        let newpost = post(data)
        let result = await post.updateOne({ _id: id, createdBy: req.userData._id }, { $set: data })
        res.status(200).json({
            status: 'ok',
            newpost: result
        })

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }


    res.send('Create new post')
}
module.exports = {
    getPosts,
    getPost,
    createPosts,
    deletePosts,
    updatePosts,
    getUserPosts
}