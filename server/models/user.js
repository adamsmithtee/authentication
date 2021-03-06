const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const jwt = require('jsonwebtoken')
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:[6, "password shorter than required length"],
    },
    token:{
        type:String
    }
})

userSchema.pre('save', function(next) {
    const user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err,salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else{
        next();
    }
})

//custom method that allows password comparison

userSchema.methods.comparePassword = function(enteredPassword, cb) {
    
    bcrypt.compare(enteredPassword, this.password, function(err, isMatch){
        if(err) throw cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    const user =this;

    jwt.verify(token, 'supersecret', function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}