const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Post = require("../models/post");
const auth = require("../middleware/auth");

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: "./templates/assets/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create new post
router.post("/posts", auth, upload.single("image"), async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
        
        await post.save();
        res.redirect("/");
    } catch (error) {
        res.render("create-post", { error: "Error creating post" });
    }
});

// Vote on post
router.post("/posts/:id/vote", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const { vote } = req.body; // 'up' or 'down'
        
        if (vote === 'up') {
            // Remove from downvotes if exists
            post.downvotes = post.downvotes.filter(id => id.toString() !== req.user._id.toString());
            
            // Toggle upvote
            if (post.upvotes.includes(req.user._id)) {
                post.upvotes = post.upvotes.filter(id => id.toString() !== req.user._id.toString());
            } else {
                post.upvotes.push(req.user._id);
            }
        } else {
            // Remove from upvotes if exists
            post.upvotes = post.upvotes.filter(id => id.toString() !== req.user._id.toString());
            
            // Toggle downvote
            if (post.downvotes.includes(req.user._id)) {
                post.downvotes = post.downvotes.filter(id => id.toString() !== req.user._id.toString());
            } else {
                post.downvotes.push(req.user._id);
            }
        }
        
        await post.save();
        res.json({ 
            upvotes: post.upvotes.length, 
            downvotes: post.downvotes.length 
        });
    } catch (error) {
        res.status(400).json({ error: "Error voting on post" });
    }
});

router.delete("/posts/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Check if the user is the author of the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }
        
        await Post.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: "Error deleting post" });
    }
});

module.exports = router;