const express = require("express")
const router = express.Router()
const UserController = require("./user.controller")
/**
 * Middleware function to authenticate user.
 * @module userRoute
 * @requires authMiddleware
 */
const {authenticate} = require("../auth/auth.middleware")

router.use(authenticate)
router.get("/profile", UserController.viewProfile)
router.post("/:user_id/follow", UserController.followUser)
router.delete("/:user_id/follow", UserController.unFollowUser)
router.get("/:user_id", UserController.viewUser)


module.exports = router