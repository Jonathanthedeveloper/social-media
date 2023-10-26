const express = require("express")
const router = express.Router()
/**
 * Require the AuthController module for handling authentication routes.
 * @type {AuthController}
 */
const AuthController = require('./auth.controller')


router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refresh)

module.exports = router