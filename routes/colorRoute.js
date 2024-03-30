import express from 'express';

import {
    createNewColorController,
    deleteColorController,
    getAllColorsController,
    getSingleColorController,
    updateColorController,
} from '../controllers/colorController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createNewColorController);
router.put('/:id', updateColorController);
router.delete('/:id', authMiddleware, isAdmin, deleteColorController);

router.get('/', getAllColorsController);
router.get('/:id', getSingleColorController);

export default router;