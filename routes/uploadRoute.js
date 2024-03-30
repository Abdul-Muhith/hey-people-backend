import express from 'express';

import {
    uploadProductImageController,
} from '../controllers/uploadController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

import {
    uploadPhotoMiddleware,
    productImgResizeMiddleware,
    blogImgResizeMiddleware,
} from '../middlewares/uploadImagesMiddleware.js';

const router = express.Router();

// AFTER CLASS 2
// router.put('/products/:id', authMiddleware, isAdmin, uploadPhotoMiddleware.array("images", 10), productImgResizeMiddleware, uploadProductImageController);
router.put('/products/', authMiddleware, isAdmin, uploadPhotoMiddleware.array("images", 10), productImgResizeMiddleware, uploadProductImageController);

router.put('/:id', authMiddleware, isAdmin, uploadPhotoMiddleware.array("images", 10), productImgResizeMiddleware, uploadProductImageController);

// router.put('/:id', authMiddleware, isAdmin, updateCouponController);

// AFTER CLASS 08
router.post('/products', authMiddleware, isAdmin, uploadPhotoMiddleware.array("images", 10), productImgResizeMiddleware, uploadProductImageController);

export default router;