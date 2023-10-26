const UserService = require("../user/user.service")
const User = require("../user/models/user.model")
const jwt = require("jsonwebtoken")
const AppError = require("../error/AppError")
const { v4: uuidv4 } = require('uuid');

/**
 * Controller class for handling authentication related requests
 */
class AuthController {

    /**
     * Generates and returns access and refresh tokens for the given user
     * @param {Object} user - User object for which tokens are to be generated
     * @param {Object} res - Express response object
     * @param {number} [status=200] - HTTP status code to be returned in the response
     * @returns {Object} - JSON response containing access and refresh tokens
     */
    static async createAuthTokens(user, res, status = 200) {
        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {expiresIn : "15m"})
            
        // Generate and save refresh token for the user
        user.refresh_token = uuidv4();
        user.refresh_token_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        const {refresh_token} = await user.save()

        return res.status(status).json({ status: "success", data: { access_token, refresh_token } })
    }

    /**
     * Registers a new user and generates access and refresh tokens for them
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Object} - JSON response containing access and refresh tokens
     */
    static async register(req, res, next) {
        try {
            const { first_name, last_name, password, password_confirm, username, email } = req.body

            const user = await UserService.createUser({
                first_name, last_name, password, password_confirm, username, email
            })

            return AuthController.createAuthTokens(user,res, 201)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Authenticates a user and generates access and refresh tokens for them
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Object} - JSON response containing access and refresh tokens
     */
    static async login(req,res,next) {
        try {

            const {user_id, password} = req.body

            const user = await User.findOne({$or: [{email: user_id} , {username: user_id}]}).select("+password")


            if(!user || !(await user.isCorrectPassword(password))) throw new AppError("Invalid credentials", 400)

            return AuthController.createAuthTokens(user,res)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Generates new access and refresh tokens for the given user using their refresh token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Object} - JSON response containing new access and refresh tokens
     */
    static async refresh(req, res, next) {
        try {
            const { refresh_token } = req.body;

            const user = await User.findOne({refresh_token, refresh_token_expires: {$gte : new Date(Date.now()) } })
            .select("+refresh_token_expires")
            .orFail(() => {
                throw new AppError("Refresh token has expired or is invalid", 400)
            })

            AuthController.createAuthTokens(user, res)
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController

