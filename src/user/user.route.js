const express = require("express")
const router = express.Router()
const UserController = require("./user.controller")
const {authenticate} = require("../auth/auth.middleware")


router.get("/profile",authenticate, UserController.viewProfile)
router.post("/:user_id/follow",authenticate, UserController.followUser)
router.delete("/:user_id/follow",authenticate, UserController.unFollowUser)
router.get("/:user_id",authenticate, UserController.viewUser)


module.exports = router