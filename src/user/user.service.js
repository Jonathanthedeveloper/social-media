const User = require("./models/user.model")
const AppError = require("../error/AppError")



class UserService {
    static async createUser(userData) {
        
            const user = await User.create(userData);

            if (!user) throw new AppError("failed to create user. please try again", 400)

            return user
     
    }
}


module.exports = UserService