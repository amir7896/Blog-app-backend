const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ==========================
// Validation For Title 
// ==========================

// Title Length Checker
let titlelengthChecker = (title) => {
    if(!title){
        return false;
    }else{
        if(title.length < 5 || title.length > 50){
            return false;
        }else{
            return true;
        }
    }
};
// valid Title checker
let alphaNumericTitleChecker = (title) => {
    if(!title){
        return false
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
}
// Array For Validators that is use in the Schema
const titleValidators = [
    {
        validator: titlelengthChecker ,
        message: 'Title Must be at least 5 characters and no more than 50 Characters'
    },
    {
        validator: alphaNumericTitleChecker,
        message: 'Please Enter A Valid Title Not Used Special Characters'
    }
]
// ===============================
// Body Validation
// ================================
// Body Length Checker
let bodyLengthChecker = (body) => {
    if(!body){
        return false;
    }else{
        if(body.length< 5 || body.length> 300){
            return false;
        }else{
            return true
        }
    }
};
// User Validators Array for used in the Schema
const bodyValidators =[
    {
        validator: bodyLengthChecker,
        message: 'Comment Must Be 5 Charcters and Less then 300 Characters'
    }
]

// ===========================
// Comment Validation
// ===========================

// Password Length Checker
let commentLengthChecker = (comment) => {
    if(!comment[0]){
        return false;
    }else{
        if(comment[0].length < 1 || comment[0].length> 200){
            return false;
        }else{
            return true
        }
    }
};

// Password Validators Array for used in the Schema
const commentValidators =[
    {
        validator: commentLengthChecker,
        message: 'Comment Must Be 1 Charcters and Less then 200 Characters'
    },

]
// =====================
// User Schema 
// =====================
const BlogSchema = new Schema({
    title: {
        type: String,
        required : true,
        validate: titleValidators
    },
    body: {
        type: String,
        required: true,
        validate: bodyValidators
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number ,
        default: 0
    },
    likedBy: {
        type: Array
    },
    dislikes: {
        type: Number ,
        default: 0
    },
    dislikedBy: {
        type: Number
    },
    comments: [
        {
            comment: {
                type: String, 
                validate: commentValidators
            },
            commentator: { type: String}
        }

    ],
});

module.exports = mongoose.model('Blog' , BlogSchema);