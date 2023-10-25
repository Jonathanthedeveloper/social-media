const express = require("express")
const router = express.Router()
const UserController = require("./user.controller")
const {authenticate} = require("../auth/auth.middleware")


router.get("/profile",authenticate, UserController.viewProfile)


module.exports = router