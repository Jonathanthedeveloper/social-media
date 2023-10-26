const express = require('express');
const router = express.Router();
const PostController = require('./post.controller');
const {authenticate} = require("../auth/auth.middleware")

router.use(authenticate)
router.post('/',PostController.createPost);
router.get('/:post_id',PostController.viewPost);
router.get('/',PostController.viewAllPosts);
router.post('/:post_id/like',PostController.likePost);
router.delete('/:post_id/like',PostController.unlikePost);

module.exports = router;
