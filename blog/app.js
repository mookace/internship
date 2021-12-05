const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const PORT = 3000
const fileupload = require('express-fileupload')


app.use(fileupload({
    limits: { fileSize: 50 * 1024 * 1024 }
}))

global.appRoot = __dirname

//database connected
mongoose.connect('mongodb://localhost/mynodeblog',
    { useNewurlparser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('database connected')
    }).catch(err => {
        console.log(err)
    })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const routes = require('./server/routes/routes')
app.use('/api', routes)


app.use(morgan('dev'))

app.listen(PORT, () => {
    console.log('Server Started at port' + PORT)
})
