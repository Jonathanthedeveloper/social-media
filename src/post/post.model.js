const mongoose = require('mongoose')
const {Schema, model} = mongoose


const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: [true, "Please provide a content for this post"]
    },
}, {
    timestamps: true,
})


PostSchema.pre(/^find/, function(next) {
    this.populate({
        path: "user",
        select: "first_name last_name username"
    })
    next()
})


const Post = model("Post", PostSchema)

module.exports = Post