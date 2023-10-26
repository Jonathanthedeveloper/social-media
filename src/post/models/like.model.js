const mongoose = require('mongoose')
const {Schema, model} = mongoose

const LikeSchema = new Schema({
    post: {
        type : Schema.Types.ObjectId,
        ref: 'Post',
    },
    user: {
        type : Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true
})

LikeSchema.index({post: 1,user:1}, {unique: true})

const Like = model('Like', LikeSchema)

module.exports = Like