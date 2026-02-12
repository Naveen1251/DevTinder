const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({ //if we dont right new also it works fine
    firstName:{   //firstName can be also written as first_name,firstname anything will work
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String
    },
    password:{
        type: String
    },
    age:{
        type: Number
    },
    gender: {
        type: String
    }

})

const User = mongoose.model("user",userSchema); //First parameter is name of model,second is schema of model
// User should always start with capital letter
module.exports = User;