const mongoose = require("mongoose");

// Check if the model exists before defining it
const Post = mongoose.models.Post || mongoose.model("Post", new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    imageUrl: {
        type: String
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}));

module.exports = Post;