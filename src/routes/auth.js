const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/register");

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        const token = jwt.sign({ _id: user._id }, "your_jwt_secret");
        await user.save();
        
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.redirect("/");
    } catch (error) {
        res.render("signup", { error: "Username or email already exists" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });
        
        if (!user) {
            throw new Error("Invalid login credentials");
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid login credentials");
        }
        
        const token = jwt.sign({ _id: user._id }, "your_jwt_secret");
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.redirect("/");
    } catch (error) {
        res.render("login", { error: "Invalid login credentials" });
    }
});

// Logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
});

module.exports = router;