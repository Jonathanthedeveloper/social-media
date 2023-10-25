const mongoose = require('mongoose')
const {Schema, model} = mongoose

const FollowSchema = new Schema({
    follower : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    following : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

FollowSchema.index({user: 1, following: 1}, {unique: true})

const Follow = model("Follow", FollowSchema)

module.exports = Follow