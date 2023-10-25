const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: [true, "Please provide your preferred username"],
        unique: [true, "The provided username is already in use"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "The provided email is already in use"]
    },
    password: {
        type: String,
        required: [true, "Please provide your preferred password"],
        select: false
    },
    password_confirm: {
        type: String,
        validate: {
            message: "Password Confirm and password do not match",
            validator: function(value) {
                return this.password === value
            }
        }
    },
    refresh_token: {
        type:String,
        select: false
    },
    refresh_token_expires : {
        type: Date,
        select: false
    }
})

UserSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
        this.password_confirm = undefined
    }

    next()
})

UserSchema.method("isCorrectPassword",async function(password) {
    return await bcrypt.compare(password, this.password)
})



const User = model("User", UserSchema)
module.exports = User

