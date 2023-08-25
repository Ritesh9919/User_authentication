const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'most privide name'],
        minLength:3,
        maxLength:20
    },
    email:{
        type:String,
        required:[true, 'most provide email'],
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'Please provide valid email'
        }
        
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:12
    }
},{timestamps:true});


const User = mongoose.model('User', userSchema);
module.exports = User;