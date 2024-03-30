import express from 'express';

import {
    createNewCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getSingleCategoryController,
    getAllCategoriesController,
} from '../controllers/productCategoryController.js';

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