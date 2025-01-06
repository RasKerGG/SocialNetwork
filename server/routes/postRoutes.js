import express from 'express';
import {getAllPosts,createPost } from '../controllers/postController.js';
import { checkAuth } from '../checkAuth.js';

const router_post = express.Router();

router_post.get('/',getAllPosts)
// router.get('/createpost',getOnePost)
router_post.post('/createpost',checkAuth,createPost)
// router.patch('/createpost',updatePost)
// router.delete('/createpost',removePost)

export default router_post