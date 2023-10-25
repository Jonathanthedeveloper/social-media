const express = require('express');
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
require("dotenv").config()
const globalErrorHandler = require("./error/error.controller")
const AuthRouter = require("./auth/auth.route")
const UserRouter = require("./user/user.route")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(helmet())
app.use(morgan("combined"))



app.use("/auth", AuthRouter)
app.use("/users", UserRouter)

app.all("*", function (req, res) {
    res.status(404).json({status: "fail", message: `cannot ${req.method} ${req.originalUrl}`})
})

app.use(globalErrorHandler)

module.exports = app