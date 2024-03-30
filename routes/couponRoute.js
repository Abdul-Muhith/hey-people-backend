import express from 'express';

import {
    createCouponController,
    getAllCouponsController,
    updateCouponController,
    deleteCouponController,
    getASingleCouponController,
} from '../controllers/couponController.js';

import {
    isAdmin,
    authMiddleware,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createCouponController);
router.get('/', getAllCouponsController);

router.put('/:id', authMiddleware, isAdmin, updateCouponController);
router.delete('/:id', authMiddleware, isAdmin, deleteCouponController);

router.get('/:id', authMiddleware, getASingleCouponController);

export default router;