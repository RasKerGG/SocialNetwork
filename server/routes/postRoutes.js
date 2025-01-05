import express from 'express';
import {getAllPosts } from '../controllers/postController.js';

const router_post = express.Router();

router_post.get('/',getAllPosts)
// router.get('/createpost',getOnePost)
// router.post('/createpost',createPost)
// router.patch('/createpost',updatePost)
// router.delete('/createpost',removePost)

export default router_post