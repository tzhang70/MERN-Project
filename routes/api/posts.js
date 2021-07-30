const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
//bringing in the models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');

//@route        POST api/post
//@description  Create a post
//@access       Private
router.post(
    '/',
    auth, 
    check('text', 'Text is required').notEmpty(),    
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try{
            const user = await User.findById(req.user.id).select('-password');
        
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post);
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
        
    }
);

//@route        GET api/post
//@description  Get all posts
//@access       Private
router.get('/', auth, async (req,res) =>{
    try{
        const posts = await Post.find().sort({ date: -1});
        res.json(posts);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

//@route        GET api/posts/:id
//@description  Get post from user ID
//@access       Private
router.get('/:id', auth, async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
        res.json(post);
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error');
    }

});
  
//@route        DELETE api/posts/:id
//@description  Delete post from user ID
//@access       Private
router.delete('/:id', auth, async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        //checks if post exists
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }

        //Check if deleter is also owner of post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized to delete'});
        }

        await post.remove();

        res.json({msg: 'Post removed'});
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error');
    }

});

//@route        Put api/posts/like/:id
//@description  Like a post
//@access       Private
router.put('/like/:id', auth, async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;