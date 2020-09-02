const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Employee','Manager','Admin'],
        default: 'Employee'
    },
    avatarUrl: {
        type: String,
        required: false
    }
});

UserSchema.pre('save', function(next){
    var user = this;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function(err, salt){
            if(err){
                return next(err);
            }
            bcrypt.hash(user.password, hash, function(err, hash){
                if(err){
                    return next(err);
                }
                user.password = hash;
            });
        });
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err){
            return callback(err);
        }
        callback(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);