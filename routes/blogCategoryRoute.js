import express from 'express';

import {
    createNewCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getSingleCategoryController,
    updateCategoryController,
} from '../controllers/blogCategoryController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createNewCategoryController);
router.put('/:id', updateCategoryController);
router.delete('/:id', authMiddleware, isAdmin, deleteCategoryController);

router.get('/', getAllCategoriesController);
router.get('/:id', getSingleCategoryController);

export default router;