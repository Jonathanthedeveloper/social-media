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
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

PostSchema.virtual("likes", {
    ref: "Like",
    localField: "_id",
    foreignField: "post"
})


PostSchema.pre(/^find/, function(next) {
    this.populate({
        path: "user",
        select: "first_name last_name username"
    })
    .populate({
        path: "likes",
        populate: {
            path: "user",
            select: "first_name last_name username"
        },
        transform: doc => {
            return {
                id: doc.user._id,
                username: doc.user.username,
                first_name: doc.user.first_name,
                last_name: doc.user.last_name,
                createdAt: doc.createdAt
            }
        }
    })
    next()
})


const Post = model("Post", PostSchema)

module.exports = Post