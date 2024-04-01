import express from 'express';

import {
    createUserController,
    loginUserController,
    getAllUsersController,
    getASingleUserController,
    deleteASingleUserController,
    updateUserController,
    editUserController,
    blockUserController,
    unBlockUserController,
    refreshTokenController,
    logoutController,
    updatePasswordController,
    forgotPasswordTokenController,
    resetPasswordController,
    loginAdminController,
    getWishListController,
    saveUserAddressController,
    userCartController,
    getUserAllCartsController,
    emptyCartController,
    applyCouponController,
    createNewOrderController,
    getLoggedInOrdersController,
    updateSingleOrderStatusController,
    getAllOrdersController,
    getAllOrdersByUserIdController,
    getMonthWiseOrdersController,
    getYearlyOrdersController,
    getSingleOrderByOrderIdController,
    createUserCartController,
    removeProductFromOwnCartController,
    updateProductQuantityFromOwnCartController,
    createNewOrderByAuthenticateUserController,
} from '../controllers/userController.js';

import {
    authMiddleware,
    isAdmin,
    isStudent,
} from '../middlewares/authMiddleware.js';

import { checkoutProductController, paymentVerificationController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/register', createUserController);
router.post('/login', loginUserController);
router.post('/admin-login', loginAdminController);
router.post('/forgot-password-token', forgotPasswordTokenController);
router.post('/cart', authMiddleware, userCartController);
router.post('/create-cart', authMiddleware, createUserCartController);
router.post('/cart/apply-coupon', authMiddleware, applyCouponController);
router.post('/cart/cash-order', authMiddleware, createNewOrderController);
router.post('/cart/authenticate-user-order', authMiddleware, createNewOrderByAuthenticateUserController);
router.post('/cart/order/checkout', authMiddleware, checkoutProductController);
router.post('/cart/order/payment-verification', authMiddleware, paymentVerificationController);

router.get('/logout', logoutController);
router.get('/all-users', getAllUsersController);
router.get('/refresh-token', refreshTokenController);
router.get('/cart', authMiddleware, getUserAllCartsController);
router.get('/logged-in-orders', authMiddleware, getLoggedInOrdersController);
router.post('/single-user-orders/:id', authMiddleware, isAdmin, getAllOrdersByUserIdController);
// TODO: should be deleted when POST is main controller
router.get('/single-user-orders/:id', authMiddleware, isAdmin, getAllOrdersByUserIdController);
//TODO: AFTER CLASS 18
router.get('/month-wise-orders', authMiddleware, getMonthWiseOrdersController);
router.get('/yearly-orders', authMiddleware, getYearlyOrdersController);
router.get('/all-orders', authMiddleware, isAdmin, getAllOrdersController);
router.get('/all-own-wishlist', authMiddleware, getWishListController);
router.get('/:id', authMiddleware, getASingleUserController);
router.get('/single-order/:id', authMiddleware, isAdmin, getSingleOrderByOrderIdController);

router.put('/save-address', authMiddleware, saveUserAddressController);
router.put('/edit-user', authMiddleware, editUserController);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUserController);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUserController);
router.put('/change-password', authMiddleware, updatePasswordController);
router.put('/reset-password/:token', resetPasswordController);
router.put('/order/update-order-status/:id', authMiddleware, updateSingleOrderStatusController);
// router.put('/cart/update-own-product-quantity/:cartItemId/:newQuantity', authMiddleware, updateProductQuantityFromOwnCartController);
router.put('/cart/update-own-product-quantity', authMiddleware, updateProductQuantityFromOwnCartController);
router.put('/:id', updateUserController);

// TODO: বডি থেকে আইডি নিয়ে উনি কাজ করতে চেয়েছিলেন কিন্তু পারেন নি। আমিও চেষ্টা করেছি। পারিনি আমিও।
router.delete('/remove-product-from-own-cart', authMiddleware, removeProductFromOwnCartController);
router.delete('/remove-product-from-own-cart/:cartItemId', authMiddleware, removeProductFromOwnCartController);
router.delete('/empty-cart', authMiddleware, emptyCartController);
router.delete('/:id', deleteASingleUserController);

export default router;