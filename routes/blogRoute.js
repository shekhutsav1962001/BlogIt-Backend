var express = require('express')
const { get } = require('mongoose')
var router = express.Router()

const blogController = require('../controllers/blogController')
const authMiddleware = require('../middlewares/authMiddleware')
const getCurrentUser = require('../middlewares/getCurrentUser')

router.get('/getallblogs', blogController.getallBlogs)
router.get('/getblog/:id', blogController.getBlog)

router.post('/addblog', authMiddleware.authMiddleware, getCurrentUser.getCurrentUser, blogController.addBlog)
router.post('/uploadfile', authMiddleware.authMiddleware, blogController.uploadFile)
router.get('/getblogedit/:id', authMiddleware.authMiddleware, blogController.getBlogEdit)
router.get('/getmyblog', authMiddleware.authMiddleware, blogController.getmyBlog)
router.put('/editblog/:id', authMiddleware.authMiddleware, blogController.editBlog)
router.delete('/deleteblog/:id', authMiddleware.authMiddleware, blogController.deleteBlog)
router.put('/addcomment/:id', authMiddleware.authMiddleware, getCurrentUser.getCurrentUser, blogController.addComment)


module.exports = router