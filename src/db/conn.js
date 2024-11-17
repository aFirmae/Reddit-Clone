const mongoose = require('mongoose');

var mongoURI = 'mongodb://nilashis:7698@localhost:27017/reddit-clone?authSource=admin' || process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;