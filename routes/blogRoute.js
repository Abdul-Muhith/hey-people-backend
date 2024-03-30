import express from 'express';

import { 
    createBlogController,
    updateBlogController,
    singleBlogController,
    getAllBlogsController,
    deleteBlogController,
    likeBlogController,
    disLikeBlogController,
} from '../controllers/blogController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createBlogController);

router.get('/', getAllBlogsController);
router.get('/:id', singleBlogController);

router.put('/likes', authMiddleware, likeBlogController);
router.put('/dislikes', authMiddleware, disLikeBlogController);
router.put('/:id', updateBlogController);

router.delete('/:id', authMiddleware, isAdmin, deleteBlogController);

export default router;