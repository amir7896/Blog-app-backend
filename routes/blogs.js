const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const jwt  = require('jsonwebtoken');



// ====================
// Add Blog
// ====================
router.post('/newblog', (req, res) => {
    if(!req.body.title){
        res.json({success: false, message: 'Title Is Required!'})
    }else{
        if(!req.body.body){
            res.json({success: false, message: 'Body Is Required!'})
        }else{
            if(!req.body.createdBy){
                res.json({success: false, message: 'Createor Is Required!'})
            }else{
                const blog = new Blog({
                    title: req.body.title,
                    body: req.body.body,
                    createdBy: req.body.createdBy
                });
                blog.save((err) => {
                    if(err){
                        if(err.errors){
                            if(err.errors.title){
                                res.json({ success: false, message: err.errors.title.message})
                            }else{
                                if(err.errors.body){
                                    res.json({success: false, message: err.errors.body.message})
                                }else{
                                    res.json({ success: false, message: err.message})
                                }
                            }
                        }else{
                            res.json({ success: false, message: err})   
                        }
                    }else{
                        res.json({success: true, message: 'Blog Added Successfully!', newBlog: blog})
                    }
                })
            }
        }
    }
})

//====================
// GET All Blogs
// ===================
// router.get('/allblogs', async(req, res) => {
//     const allblog = await Blog.find({}, (err, blogs)=> {
//         if(err){
//             res.json({success: false, message: err})
//         }else{
//             if(!blogs){
//                 res.json({success: false, message: 'There is no Blog in The Data Base'})
//             }else{
//                 res.json({success: true, ALLBlogs: blogs})
//             }
//         }
//     }).sort({'_id': -1});


// })
router.get('/allblogs', async(req, res) => {
    const allblogs = await Blog.find({}).sort({'_id': -1});
    res.json(allblogs);
});

module.exports = router;


