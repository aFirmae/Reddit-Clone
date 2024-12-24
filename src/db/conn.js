const mongoose = require('mongoose');

var mongoURI = 'mongodb+srv://Nilashis:7698@reddit-cluster.bdit5.mongodb.net/reddit-clone' || process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;