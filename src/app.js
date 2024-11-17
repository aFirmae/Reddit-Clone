const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("./middleware/auth");
const conn = require("./db/conn");
const register = require("./models/register");
const Post = require("./models/post");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3200;

// Set up handlebars engine and views directory
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.static(path.join(__dirname, '../templates/assets')));

// Helper functions for handlebars
hbs.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString();
});

hbs.registerHelper('hasUpvoted', function(post, options) {
    const user = options.data.root.user;
    if (!user) return false;
    return post.upvotes.some(id => id.toString() === user._id.toString());
});

hbs.registerHelper('hasDownvoted', function(post, options) {
    const user = options.data.root.user;
    if (!user) return false;
    return post.downvotes.some(id => id.toString() === user._id.toString());
});

hbs.registerHelper('isAuthor', function(post, options) {
    const user = options.data.root.user;
    if (!user) return false;
    return post.author._id.toString() === user._id.toString();
});


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Parse cookies
app.use(cookieParser());

// Set static folder for assets
app.use("/css", express.static(path.join(__dirname, "../templates/assets/css")));
app.use("/images", express.static(path.join(__dirname, "../templates/assets/images")));
app.use("/uploads", express.static(path.join(__dirname, "../templates/assets/uploads")));

// Use routes
app.use(authRoutes);
app.use(postRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: "../templates/assets/uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });
  
// Main page route
app.get("/", auth, async (req, res) => {
    try {
        // Redirect to login if no user is authenticated
        if (!req.user) {
            return res.redirect('/login');
        }

        const posts = await Post.find()
            .populate("author", "username")
            .sort({ createdAt: -1 });
            
        res.render("index", { 
            user: req.user,
            posts: posts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send(error);
    }
});

// Login route - only if user is not already logged in
app.get("/login", auth, (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("login");
});

// Signup route - only if user is not already logged in
app.get("/signup", auth, (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("signup");
});

// Create post page
app.get("/create-post", auth, (req, res) => {
    res.render("create-post", { user: req.user });
});