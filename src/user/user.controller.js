const ApiFilter = require('../utils/apiFilter');
const User = require('./user.model');

class UserController {
    static async viewProfile (req,res,next) {
        try {
            const query = new ApiFilter(User.findOne({_id: req.user.id}), req.query)
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
}

module.exports = UserController