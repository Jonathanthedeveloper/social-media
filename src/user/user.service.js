const User = require("./user.model")
const AppError = require("../error/AppError")



class UserService {
    static async createUser(userData) {
        
            const user = await User.create(userData);

            if (!user) throw new AppError("failed to create user. please try again", 400)

            return user
     
    }

    static findUser(filter) {

    }
}


module.exports = UserService