import express from 'express';
import { getAllPosts,createPost,getOnePost,updatePost,removePost } from '../controllers/postController.js';
import {addLike,removeLike} from '../controllers/likeController.js';
import { checkAuth } from '../checkAuth.js';
import { postValidation } from '../validations.js';

const router_post = express.Router();

router_post.get('',getAllPosts)
router_post.get('/:id',getOnePost)
router_post.post('/',checkAuth,postValidation,createPost)
router_post.patch('/:id',checkAuth,postValidation,updatePost)
router_post.delete('/:id',checkAuth,removePost)

//роуты для лайков(поскольку лайки нужны только для постов)
router_post.post('/:postId/like',checkAuth,addLike)
router_post.delete('/:postId/like',checkAuth,removeLike)

export default router_post