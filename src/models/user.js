const mongoose = require("mongoose")
const validator = require("validator") //this is a library which helps us to validate email,phone number etc

const userSchema = new mongoose.Schema({ //if we dont right new also it works fine
    firstName:{   //firstName can be also written as first_name,firstname anything will work
        type: String,
        required: true,
        minlength: 4, //if we want to set minimum length of name
        maxlength: 30 //if we want to set maximum length of name
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required:true,
        unique: true,
        lowercase: true, //this will convert email to lowercase before saving in database
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id" + value)
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 8, //if we want to set minimum length of password
            validate(value){
                if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong Password"+value)
            }
            }
    },
    age:{
        type: Number,
        min: 18, //if we want to set minimum age limit
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid Gender Value")
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png" //if user dont upload any photo then this default photo will be used
    },
    about:{
        type: String,
        default: "Hey there! I am using this app." //if user dont write anything in about section then this default about will be used
    }

},{timestamps: true}) //this will automatically add createdAt and updatedAt field in our database

const User = mongoose.model("user",userSchema); //First parameter is name of model,second is schema of model
// User should always start with capital letter
module.exports = User;