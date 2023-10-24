const express = require('express');
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
require("dotenv").config()

const app = express()

app.set(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("combined"))





app.all("*", function (req, res) {
    res.status(404).json({status: "fail", message: `cannot ${req.method} ${req.originalUrl}`})
})

module.exports = app