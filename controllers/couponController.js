import asyncHandler from 'express-async-handler';

import Coupon from '../models/couponModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

// Create a new Coupon

export const createCouponController = asyncHandler(async (req, res) => { 
    const newCoupon = await Coupon.create(req.body);

    if (!newCoupon) throw new Error('Could not create Coupon');

    res.json(newCoupon);
});

// Get all Coupon

export const getAllCouponsController = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find()

    if (!coupons) throw new Error('Could not found Coupon');

    res.json(coupons);
});

// Update a Coupon with ID

export const updateCouponController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const updateCoupon = await Coupon.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    res.json(updateCoupon);
});

// Delete Coupon

export const deleteCouponController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);

    const deleteCoupon = await Coupon.findByIdAndDelete(id);

    res.json(deleteCoupon);
});

// Get a single Coupon

export const getASingleCouponController = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    validateMongodbId(id);

    const findCoupon = await Coupon.findById(id);

    if (!findCoupon) {
        throw new Error("Coupon not Found");
    }

    res.json(findCoupon);
});

// export const Controller = asyncHandler(async (req, res) => { });