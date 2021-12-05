const express = require('express')
const router = express.Router()

const {
    getPosts,
    getPost,
    createPosts,
    deletePosts,
    updatePosts,
    getUserPosts
} = require('../controller/postController')

const checkAuth = require('../middleware/checkAuth')


router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/posts/:id', getUserPosts)
router.post('/', checkAuth, createPosts)
router.delete('/:id', checkAuth, deletePosts)
router.patch('/:id', checkAuth, updatePosts)

// for authentication

const { signup, login } = require('../controller/userController')
router.post('/user/login', login)
router.post('/user/signup', signup)

module.exports = router
