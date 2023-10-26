const ApiFilter = require('../utils/apiFilter');
const User = require('./models/user.model');
const Follow = require("./models/follow.model");
const AppError = require('../error/AppError');

// const users = [
//     {
//       first_name: 'John',
//       last_name: 'Doe',
//       username: 'johndoe',
//       email: 'johndoe@example.com',
//       password: '12345678',
//       password_confirm: '12345678'
//     },
//     {
//       first_name: 'Jane',
//       last_name: 'Doe',
//       username: 'janedoe',
//       email: 'janedoe@example.com',
//       password: '12345678',
//       password_confirm: '12345678'
//     },
//     {
//       first_name: 'Bob',
//       last_name: 'Smith',
//       username: 'bobsmith',
//       email: 'bobsmith@example.com',
//       password: '12345678',
//       password_confirm: '12345678'
//     },
//     {
//       first_name: 'Alice',
//       last_name: 'Johnson',
//       username: 'alicejohnson',
//       email: 'alicejohnson@example.com',
//       password: '12345678',
//       password_confirm: '12345678'
//     },
//     {
//       first_name: 'David',
//       last_name: 'Lee',
//       username: 'davidlee',
//       email: 'davidlee@example.com',
//       password: '12345678',
//       password_confirm: '12345678'
//     }
//   ];
  
//    User.create(users);

/**
 * Controller class for user-related operations
 */
class UserController {

    /**
     * View the profile of the authenticated user
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The user profile data
     */
    static async viewProfile (req,res,next) {
        try {

            const profileQuery = User.findOne({_id: req.user.id})
            .populate({path: "followings",populate: "following",transform: (doc) => {
                return {
                    id: doc.following._id,
                    first_name: doc.following.first_name,
                    last_name: doc.following.last_name,
                    username: doc.following.username,
                }
            }})
            .populate({path: "followers" ,populate: "follower",transform: (doc) => {
                return {
                    id: doc.follower._id,
                    first_name: doc.follower.first_name,
                    last_name: doc.follower.last_name,
                    username: doc.follower.username,
                }
            }})
            .populate({path: "posts", select: "content createdAt"})

            const query = new ApiFilter(profileQuery, req.query)
            .filter({singleDoc: true}).limitFields()

            const user = await query.query

            res.status(200).json({
                status: "success",
                data: user
            })
            
        } catch (error) {
            next(error)
        }
    }

    /**
     * View the profile of a user by ID
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The user profile data
     */
    static async viewUser(req,res,next) {
        try {

            const userQuery = User.findOne({_id: req.params.user_id})
            .populate({path: "followings",populate: "following",transform: (doc) => {
                return {
                    id: doc.following._id,
                    first_name: doc.following.first_name,
                    last_name: doc.following.last_name,
                    username: doc.following.username,
                }
            }})
            .populate({path: "followers" ,populate: "follower",transform: (doc) => {
                return {
                    id: doc.follower._id,
                    first_name: doc.follower.first_name,
                    last_name: doc.follower.last_name,
                    username: doc.follower.username,
                }
            }})
            .populate({path: "posts", select: "content createdAt"})

            const query = new ApiFilter(userQuery, req.query)
            .filter({singleDoc: true}).limitFields()

            const user = await query.query

            res.status(200).json({
                status: "success",
                data: user
            })
            
        } catch (error) {
            next(error)
        }
    }

    /**
     * Follow a user by ID
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - A success message
     */
    static async followUser(req,res,next) {
        try {

            const follow = await Follow.create({
                follower: req.user.id,
                following: req.params.user_id
            })
            
            if (!follow)throw new AppError("Failed to follow user", 400)

            res.status(201).json({
                status: "success",
                message: "Followed user"
            })
            
        } catch (error) {
            next(error)
        }
    }

    /**
     * Unfollow a user by ID
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - A success message
     */
    static async unFollowUser(req,res,next) {
        try {

            const follow = await Follow.findOneAndDelete({
                follower: req.user.id,
                following: req.params.user_id
            })
            
            if (!follow)throw new AppError("Failed to unfollow user", 400)

            res.status(204).json({
                status: "success",
                message: "Unfollowed user"
            })
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController