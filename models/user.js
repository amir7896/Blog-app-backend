const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


// ==========================
// Validation For Email 
// ==========================

// Email Length Checker
let emaillengthChecker = (email) => {
    if(!email){
        return false;
    }else{
        if(email.length < 7 || email.length > 30){
            return false;
        }else{
            return true;
        }
    }
};
// valid email checker
let validEmailChecker = (email) => {
    if(!email){
        return false
    }else{
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}
// Array For Validators that is use in the Schema
const emailValidators = [
    {
        validator: emaillengthChecker ,
        message: 'Email Must be at least 7 characters and no more than 40 Characters'
    },
    {
        validator: validEmailChecker,
        message: 'Please Enter A Valid Email'
    }
]
// ===============================
// Username Validation
// ================================
// Username Length Checker
let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length< 3 || username.length> 15){
            return false;
        }else{
            return true
        }
    }
};
// Username vlaid string checker
let validUsernmae = (username) => {
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};
// User Validators Array for used in the Schema
const usernameValidators =[
    {
        validator: usernameLengthChecker,
        message: 'Username Must Be 3 Charcters and Less then 15 Characters'
    },
    {
        validator: validUsernmae,
        message: 'User Does not Have Any Special Character '
    }
]

// ===========================
// Password Validation
// ===========================

// Password Length Checker
let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    }else{
        if(password.length < 5 || password.length> 15){
            return false;
        }else{
            return true
        }
    }
};
// Valid Password Checker
let validPassword = (password) => {
    if(!password){
        return false;
    }else{
        const regExp = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,15}$/);
        return regExp.test(password);
    }
};

// Password Validators Array for used in the Schema
const passwordValidators =[
    {
        validator: passwordLengthChecker,
        message: 'Password Must Be 5 Charcters and Less then 15 Characters'
    },
    {
        validator: validPassword,
        message: 'Password must have  One Uppercase letter One  a Special Character and One Number! '
    },

]
// =====================
// User Schema 
// =====================
const UserSchema = new Schema({
    email : {
        type: String,
        required : true,
        unique: true,
        validate: emailValidators
    },
    username: {
        type: String,
        required:  true,
        validate: usernameValidators,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate:passwordValidators

    }

});

// UserSchema.statics.findAndValidate = async function (username, password) {
//     const foundUser = await this.findOne({ username });
//     const isValid = await bcrypt.compare(password, foundUser.password);
//     return isValid ? foundUser : false;
// }
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
// Compare Password
UserSchema.methods.comparePassword = function(password)  {
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User' , UserSchema);