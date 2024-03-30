import express from 'express';

import {
    createNewBrandController,
    deleteBrandController,
    getAllBrandsController,
    getSingleBrandController,
    updateBrandController,
} from '../controllers/brandController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createNewBrandController);
router.put('/:id', updateBrandController);
router.delete('/:id', authMiddleware, isAdmin, deleteBrandController);

router.get('/', getAllBrandsController);
router.get('/:id', getSingleBrandController);

export default router;