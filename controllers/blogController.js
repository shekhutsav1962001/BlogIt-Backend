var Blog = require('../models/blog')
const fileuploadMiddleware = require('../middlewares/fileuploadMiddleware')
exports.addBlog = (req, res) => {

    const { title, content } = req.body;
    if (!title || !content) {
        res.json({ error: "All fields are required" })
    }
    var blog = new Blog({
        title, content: content.toString(), user: req.user
    })
    try {
        doc = blog.save();
        console.log("Successfully blog added")
        return res.json({ message: 'Successfully blog added' });
    }
    catch (err) {
        return res.json({ error: 'Somthing went wrong' });
    }
}

exports.getallBlogs = async (req, res) => {

    try {
        const blogs = await Blog.find({})
        // console.log(blogs)
        return res.json({ blogs });
    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.getBlog = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.json({ error: 'Id is required' });
        }
        const blog = await Blog.findOne({ _id: req.params.id })

        return res.json({ blog });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.getmyBlog = async (req, res) => {

    try {
        const blogs = await Blog.find({ "user.email": req.email })
        return res.json({ blogs });
    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.uploadFile = async (req, res) => {

    try {
        const file = req.file

        if (!file) {
            res.json({ error: "File is required" })
        }
        const url = await fileuploadMiddleware.uploadImage(file)
        return res.json({ message: url });
    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.getBlogEdit = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.json({ error: 'Id is required' });
        }
        const blog = await Blog.findOne({ _id: req.params.id, "user.email": req.email })
        if (!blog) {
            return res.json({ error: "unauthorized request", status: 401 })
        }
        return res.json({ blog });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.editBlog = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.json({ error: 'Id is required' });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            res.json({ error: "All fields are required" })
        }
        _ = await Blog.updateOne({ _id: req.params.id, "user.email": req.email }, { title, content })
        return res.json({ message: 'successfully updated blog' });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}

exports.deleteBlog = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.json({ error: 'Id is required' });
        }

        _ = await Blog.deleteOne({ _id: req.params.id, "user.email": req.email })
        return res.json({ message: 'successfully deleted blog' });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}


exports.addComment = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.json({ error: 'Id is required' });
        }
        let { comment } = req.body
        _ = await Blog.updateOne({ _id: req.params.id }, {
            $push: {
                comments: { name: req.user.name, comment, profile: req.user.picture }
            }
        })
        return res.json({ message: 'successfully comment posted' });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}