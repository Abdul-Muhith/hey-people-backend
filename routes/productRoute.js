import express from 'express';

import {
    createProductController,
    deleteProductController,
    getASingleProductController,
    getAllProductsController,
    updateProductController,
    addToWishlistController,
    ratingProductController,
} from '../controllers/productController.js';

import {
    isAdmin,
    authMiddleware,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProductController);

router.get('/all-products', getAllProductsController);
router.get('/:id', authMiddleware, isAdmin, getASingleProductController);

router.put('/wishlist', authMiddleware, addToWishlistController);
router.put('/rate', authMiddleware, ratingProductController);
router.put('/:id', authMiddleware, isAdmin, updateProductController);

router.delete('/:id', authMiddleware, isAdmin, deleteProductController);

export default router;