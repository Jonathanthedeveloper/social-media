const jwt = require('jsonwebtoken');
const User = require("../user/models/user.model")

async function authenticate(req, res, next) {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const access_token = token.split(" ").at(1)

    try {
        // Verify the token
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET_TOKEN);


        // verify that the user exists
        const user = await User.findOne({_id: decoded.id})

        // Add the user to the request object
        req.user = user;

        // Call the next middleware
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = {authenticate};
