var User = require('../models/user')
exports.getCurrentUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.email }).select("-password").select("-firstname").select("-lastname")
        if (!user) {
            console.log("User not found in getUser Middleware");
            return res.json({ error: "Something went wrong" })
        }
        else {
            req.user = user
            next()
        }
    } catch (error) {
        return res.json({ error: "Something went wrong" })
    }


}
