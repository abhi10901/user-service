'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    randomstring = require('randomstring'),
    passwordHash = require('password-hash');

var UserSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: [true, 'First name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required']
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    passwordHash: {
        type: String
    },
    role: {
        type: String,
        enum: ['MEMBER', 'CLIENT', 'OWNER', 'ADMIN'],
        default: 'MEMBER'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: getRandomNumber
    }
}, {
    timestamps: true
});

function getRandomNumber() {
    return randomstring.generate({length: 6, charset: 'numeric'});
}

// UserSchema.pre('save', function(next) {

//     const user = this;
//     if(!user.isModified('passwordHash')) return next();

//     user.passwordHash = passwordHash.generate(passwordHash);
//     next();
//     // const user = this,
//     //       SALT_FACTOR = 5;

//     // if(!user.isModified('passwordHash')) return next();

//     // bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
//     //     if(err) return next(err);

//     //     bcrypt.hash(user.passwordHash, salt, null, function(err, hash) {
//     //         if(err) return next(err);
//     //         user.passwordHash = hash;
//     //         next();
//     //     });
//     // })
// })

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    if(!passwordHash.verify(candidatePassword, this.passwordHash)) {
        return cb(null, false);
    }
    cb(null, true);
    // bcrypt.compare(candidatePassword, this.passwordHash, function(err, isMatch) {
    //     if(err) return cb(err);
    //     cb(null, isMatch);
    // });
}

module.exports = mongoose.model('user', UserSchema);