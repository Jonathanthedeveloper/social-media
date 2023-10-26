const express = require('express');
const router = express.Router();
const PostController = require('./post.controller');
/**
 * Middleware function to authenticate user.
 * @module postRoute
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const {authenticate} = require("../auth/auth.middleware")

router.use(authenticate)
router.post('/',PostController.createPost);
router.get('/:post_id',PostController.viewPost);
router.get('/',PostController.viewAllPosts);
router.post('/:post_id/like',PostController.likePost);
router.delete('/:post_id/like',PostController.unlikePost);

module.exports = router;
