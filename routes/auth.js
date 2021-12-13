const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt  = require('jsonwebtoken');


// ===================
// Register Route
// ===================
router.post('/register', async(req, res) => {
    if(!req.body.email){
        res.json({success: false, message: 'Provide email!'});
    }else{
        if(!req.body.username){
            res.json({success: false, message: 'Provide Username'});
        }else{
            if(!req.body.password){
                res.json({success: false, message: 'Provide Password'})
            }else
            {
                let user = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                });
                await user.save((err) => {
                    if(err){
                        if(err.code ===11000){
                            res.json({success: false, message: 'Email Already Exists!'})
                            console.log(err.message)
                        }else{
                            if(err.errors){
                                if(err.errors.email){
                                    res.json({success: false, message: err.errors.email.message})
                                }else{
                                    if(err.errors.username){
                                        res.json({success: false, message: err.errors.username.message})
                                    }else{
                                        if(err.errors.password){
                                            res.json({success:false, message: err.errors.password.message})
                                        }else{
                                            res.json({success: false, message: 'Could Not Save User!'})
                                        }
                                    }
                                }
                            }
                        }
                    }else
                    {

                        // let payload = {subject: user._id};
                        // let token   = jwt.sign(payload, 'secretkey');
                        res.json({success: true , message: 'User Registered uccessfully' , User: user})
                    }
                });
                
            }
        }
    }
});
// ==================
// Login Route
// ==================
router.post('/login',  (req, res) => {
    if(!req.body.username){
        res.json({success: false, message: 'Username is Required!'})
    }else{
        if(!req.body.password){
            res.json({success: false, message: 'Password is Required!'})
        }else{

            User.findOne({username:req.body.username}, (err,user) => {
                if(err){
                    res.json({success:false, err})
                }else{
                    if(!user){
                        res.json({success: false, message: 'Cannot Find User By Given Name!'})
                    }else{
                        const validPassword = user.comparePassword(req.body.password);
                        if(!validPassword){
                            res.json({success:false , message: 'Invalid Username Or Password!'})
                        }else{
                            const token = jwt.sign({userId: user._id}, 'secret', {expiresIn: '24h'})
                            res.json({success: true, message: 'Login Successfully!', user:user, token: token})
                        }
                    }
                }
            })
        }
    }
})

// ========================
// Middleware For Headers
// ========================
router.use((req, res, next) => {
   const token = req.headers['authorization']
   if(!token){
       res.json({success: false, message: 'No Token Find!'})
   }else{
       jwt.verify(token, 'secret', (err, decoded) => {
           if(err){
               res.json({success: false, message: 'Invalid Token' +err})
           }else{
               req.decoded = decoded
               next();
           }
       })
   }
})
// =========================
// Get Login User Profile
// ========================
router.get('/profile', (req , res) => {
    User.findOne({_id: req.decoded.userId}).select('username email').exec((err, user) => {
        if(err){
            res.json({success: false, message: err})
        }else{
            if(!user){
                res.json({success: false, message: 'User Not Found'})
            }else{
                res.json({success: true, User: user})
            }
        }
    })
})


module.exports = router;