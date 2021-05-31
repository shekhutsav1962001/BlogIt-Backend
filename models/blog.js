var mongoose = require('mongoose')
var blogSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: { type: String, default: new Date().toDateString() },
    comments: [{
        name: String,
        comment: String,
        profile: String,
        date: { type: String, default: new Date().toDateString() }
    }]
})

module.exports = mongoose.model('blog', blogSchema)
