var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth', {useMongoClient:true});

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

var Signup = module.exports = mongoose.model('Signup', UserSchema);

module.exports.comparePassword = function(candidatePassowrd, hash, callback){
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback){
    Signup.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    Signup.findOne(query, callback);
}

module.exports.createUser = function(newUser,callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;

        // Set Hashed password
        newUser.password = hash;

        // Create User
        newUser.save(callback);
    });
};
