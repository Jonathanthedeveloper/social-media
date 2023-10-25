const Post = require("./post.model")
const ApiFilter = require("../utils/apiFilter")
const User = require("../user/models/user.model")

class PostController {
    static async createPost(req,res,next) {
        try {
            const post = await Post.create({
                user: req.user.id,
                content: req.body.content
            })

            if(!post) {
                return next(new AppError("Failed to publish post", 400))
            }

            res.status(201).json({
                status: "success",
                data: post
            })
        } catch (error) {
            next(error)
        }
    }

    static async viewPost(req,res,next) {
        try {
            const postQuery = Post.findById(req.params.post_id).orFail(new AppError("Post not found", 404))
            .populate({path: "user", select: "first_name last_name username"})

            const query = new ApiFilter(postQuery, req.query)
            .filter({singleDoc: trusted})
            .limitFields()

            const post = await query.query

            if(!post) {
                return next(new AppError("Post not found. Try removing some filters", 404))
            }


            res.status(200).json({
                status: "success",
                data: post
            })
        } catch (error) {
            next(error)
        }
    }

    static async viewAllPosts(req,res,next){
        // ensure i only get posts of user's that i follow
        try {
            // Get the user's following list
            const {followings} = await User.findById(req.user.id).populate({path: "followings", transform: doc => doc._id});
        
    
            // Get all posts from users that the current user follows
            const postsQuery = Post.find({ user: { $in: [...followings, req.user.id] } })
            .populate({ path: "user", select: "first_name last_name username" }).orFail(new AppError("No posts found. Try Following some people to see their posts", 404));
            
            const query = new ApiFilter(postsQuery, req.query);

            const posts = await query.query;
    
            res.status(200).json({
                status: "success",
                data: posts,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PostController;
