import express from 'express';
import { getAllPosts,createPost,getOnePost,updatePost,removePost } from '../controllers/postController.js';
import {addLike,removeLike} from '../controllers/likeController.js';
import {createComment,removeComment,updateComment,getComments} from '../controllers/commentController.js';
import { checkAuth } from '../checkAuth.js';
import { postValidation,commentValidation } from '../validations.js';

const router_post = express.Router();
//роуты постов
router_post.get('',getAllPosts)
router_post.get('/:id',getOnePost)
router_post.post('/',checkAuth,postValidation,createPost)
router_post.patch('/:id',checkAuth,postValidation,updatePost)
router_post.delete('/:id',checkAuth,removePost)

//роуты для лайков(поскольку лайки нужны только для постов)
router_post.post('/:postId/like',checkAuth,addLike)
router_post.delete('/:postId/like',checkAuth,removeLike)

//роуты для комментариев к посту
router_post.get('/:postId/comments',getComments)
router_post.post('/:postId/comments',checkAuth,commentValidation,createComment)
router_post.put('/:postId/comments/:commentId',checkAuth,commentValidation,updateComment) // put,посколько нам нужно обновлять одно поле
router_post.delete('/:postId/comments/:commentId',checkAuth,removeComment)

export default router_post