const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageurl: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    createdBy: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('post', postSchema)