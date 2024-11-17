const jwt = require("jsonwebtoken");
const User = require("../models/register");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            req.user = null;
            return next();
        }
        
        const decoded = jwt.verify(token, "your_jwt_secret");
        const user = await User.findOne({ _id: decoded._id });
        
        if (!user) {
            req.user = null;
            return next();
        }
        
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

module.exports = auth;