import asyncHandler from 'express-async-handler';
import jwt from "jsonwebtoken";
import uniqId from "uniqid";

import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

import generateToken from '../configs/jwtToken.js';
import generateRefreshToken from '../configs/refreshToken.js';

import { sendMail } from './mailController.js';

import crypto from 'crypto';

// Create a new User

export const createUserController = asyncHandler(async (req, res) => {
    const email = req.body.email;

    // check if user already exists or not
    const findUser = await User.findOne({ email });

    if (!findUser) {
        // const newUser = new User({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     email: req.body.email,
        //     mobile: req.body.mobile,
        //     password: <PASSWORD>,
        // });
        // await newUser.save();
        // res.status(201).json({
        //     message: 'User created successfully',
        // });
        const newUser = User.create(req.body);

        res.json(newUser);
    } else {
        // res.json({
        //     msg: "User already exists",
        //     success: false,
        // });
        throw new Error("User already exists");
    }
});

// Log in a user

export const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // check if user exists or not
    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {

        const refreshToken = await generateRefreshToken(findUser?._id);

        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            { refreshToken: refreshToken },
            { new: true }
        );

        res.cookie('refreshToken', refreshToken, updateUser, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000 // যেহেতু আমরা কনফিগ ফাইলটি তে RefreshTokenGenerate করেছি ৩ দিন
        });

        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: 'Bearer ' + generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

// Admin Login

export const loginAdminController = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

    // check if user exists or not
    const findAdmin = await User.findOne({ email });

    const adminRole = findAdmin?.role.find((role) => role === 'admin');
    if (!adminRole) throw new Error("Not Authorized");

    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {

        const refreshToken = await generateRefreshToken(findAdmin?._id);

        const updateAdmin = await User.findByIdAndUpdate(
            findAdmin.id,
            { refreshToken: refreshToken },
            { new: true }
        );

        res.cookie('refreshToken', refreshToken, updateAdmin, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000 // যেহেতু আমরা কনফিগ ফাইলটি তে RefreshTokenGenerate করেছি ৩ দিন
        });

        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: 'Bearer ' + generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

// handle refresh token

export const refreshTokenController = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // কুকি তো থাকবেই, তাহলে আবার cookie? দেওয়ার দরকার কী? না দিলেও হতো, আমার মতামত
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies"); // refresh token is not present in cookies

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error(" No Refresh token present in db or not matched"); // invalid user with your provided refresh token

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {

        if (err || user.id !== decoded.id) throw new Error("There is something wrong with refresh token");

        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// Logout the user functionality

export const logoutController = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });

        res.sendStatus(204); // forbidden
    };

    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(200);
})

// Get all Users

export const getAllUsersController = asyncHandler(async (req, res) => {
    const users = await User.find()

    if (!users) {
        throw new Error("Data not Found");
    }

    res.json(users);
});

// Get a single User

export const getASingleUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateMongodbId(id);

    const user = await User.findById(id);

    if (!user) {
        throw new Error("User not Found");
    }

    res.json(user);
});

// Delete a single User

export const deleteASingleUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateMongodbId(id);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new Error("User not Found");
    }

    res.json(user);
});

// Update a user with ID

export const updateUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateMongodbId(id);

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            role: req?.body?.role,
            mobile: req?.body?.mobile
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not updated");
    }

    res.json(updatedUser);
});

// EDIT a user with ID from token

export const editUserController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    console.log('Edit user -> ', _id);

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            role: req?.body?.role,
            mobile: req?.body?.mobile
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not updated");
    }

    res.json(updatedUser);
});

// BLock a user

export const blockUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const blockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
    );

    if (!blockUser) {
        throw new Error("User not blocked Yet");
    }

    res.json({message: 'User Blocked Successfully', blockUser});
});

// unBLock a user

export const unBlockUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const unBLockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
        );

        if (!unBLockUser) {
            throw new Error("User Blocked on this time");
        }

        res.json({message: 'User Block Cleared Successfully', unBLockUser});
});

// User Could Update their password

export const updatePasswordController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);

    const user = await User.findById(_id);

    if (password) {
        user.password = password;
        const updatePassword = await user.save();

        res.json(updatePassword);
    } else {
        res.json(user);
    }
});

// forgot password reset token

export const forgotPasswordTokenController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found with this email");

    const token = await user.createPasswordResetToken();

    if (!token) throw new Error("Something wrong with Create Password Reset Token");

    await user.save();

    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/account/reset-password/${token}'>Click Here</>`;

    const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
    };

    sendMail(data);

    res.json({message: 'Password reset token Successfully Created', token});
});

// reset password

export const resetPasswordController = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error(" Token Expired, Please try again later");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json({message: 'Password reset Successfully', user});
});

// Get wishlist

export const getWishListController = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    // const findWishList = await User.findById(_id);

    const findWishList = await User.findById(_id).populate('wishlist');

    res.json(findWishList);
});

// Save User Address

export const saveUserAddressController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { address: req?.body?.address },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User Address not updated");
    }

    res.json(updatedUser);
});

// Create User Cart

export const userCartController = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);

    let products = [];

    const user = await User.findById(_id);

    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    if (alreadyExistCart) { alreadyExistCart.remove(); };

    for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await Product.findById(cart[i]._id).select("price").exec();

        object.price = getPrice.price;
        products.push(object);
    }

    let cartTotal = 0;

    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({
        products,
        cartTotal,
        orderBy: user?._id,
    }).save();

    res.json(newCart);
});

// Get all Carts of a LOGGEDIN USER

export const getUserAllCartsController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    const user = await Cart.find({ userId: _id }).populate("productId").populate("color");

    // const user = await Cart.findOne({ orderBy: _id }).populate(
    //     "products.product",
    //     "_id title price totalAfterDiscount"
    // );
    // const user = await Cart.find({ orderBy: _id }).populate(
    //     "products.product",
    //     "_id title price totalAfterDiscount"
    // );

    res.send(user);
});

// Empty cart

export const emptyCartController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndReplace({ orderBy: user?._id });

    if(!cart) throw new Error('Cart not found');

    res.json(cart);
});

// Apply Coupon

export const applyCouponController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const { coupon } = req.body;

    const validCoupon = await Coupon.findOne({ name: coupon });
    if(validCoupon === null) throw new Error('Invalid coupon');

    const user = await User.findOne({ _id });
    if (!user) throw new Error('User not found');

    let { cartTotal } = await Cart.findOne({ orderBy: user._id, }).populate("products.product");

    let totalAfterDiscount = (
        cartTotal - (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
        { orderBy: user._id },
        { totalAfterDiscount },
        { new: true }
    );

    res.json({ totalAfterDiscount });
});

// Create a new Order

export const createNewOrderController = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);

    if (!COD) throw new Error("Creating cash order failed");

    const user = await User.findById(_id);

    let userCart = await Cart.findOne({ orderBy: user._id });

    // FINAL AMOUNT CALCULATION
    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount;
    } else {
        finalAmount = userCart.cartTotal;
    }

    // GENERATE A NEW ORDER & SAVE TO DATABASE
    let newOrder = await new Order({
         // TODO: AFTER CLASS 18
         // TODO: selected products only, but not for now
         // orderItems: userCart.products,
        products: userCart.products,
        totalPrice: userCart.cartTotal,
        totalAfterDiscount: finalAmount,
        // totalAfterDiscount: (couponApplied && userCart.totalAfterDiscount) ? userCart?.totalAfterDiscount : userCart?.totalPrice,
        paymentIntent: {
            id: uniqId(),
            method: "COD",
            amount: finalAmount,
            status: "Cash on Delivery",
            created: Date.now(),
            currency: "usd",
        },
        shippingInfo: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            mobile: user?.mobile,
            email: user?.email
        },
        orderBy: user._id,
        orderStatus: "Cash on Delivery",
    }).save();

    // UPDATE PRODUCT MODEL FOR IT'S QUANTITY & SOLD
    let update = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: {
                    $inc: {
                        quantity: -item.count,
                        sold: +item.count
                    }
                },
            },
        };
    });

    const updated = await Product.bulkWrite(update, {});

    // IT'S TIME TO DELETE THIS USER CART
    if (updated) {
        console.log('userCart', userCart);
        // console.log('updated', updated);
        const preDelete = await Cart.findByIdAndDelete(userCart._id);
            // .remove().exec();
        res.json({ message: "success", preDelete });
    };

    // res.json({ message: "success" });
});

// Get all Orders of logged in user

export const getLoggedInOrdersController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    // const findOrders = await Order.findOne({ orderBy: _id });
    // const findOrders = await Order.findOne({ orderBy: _id }).populate("products.product").populate("orderBy").exec();
    const findOrders = await Order.find({ orderBy: _id }).populate("products.product").populate("orderBy").exec();

    res.json(findOrders);
});

// Get all Orders //TODO: CLASS 18

export const getAllOrdersController = asyncHandler(async (req, res) => {
    const allOrders = await Order.find().populate("products.product").populate("orderBy").exec();

    // res.json({allOrders}); //TODO: এভাবে করলে রিডাক্সের মধ্যে আবার নতুন করে allOrders{} এভাবে ডাটা আসে। এভাবে আরেকটি ধাপ তৈরি করার কী দরকার।
    res.json(allOrders);
});

// Update an Order's STATUS

export const updateSingleOrderStatusController = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongodbId(id);

    const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
            orderStatus: status,
            paymentIntent: { status: status }
        },
        { new: true }
    );

    res.json(updateOrderStatus);
});

// Get all Orders by user ID //TODO: CLASS 17

export const getAllOrdersByUserIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    // const findOrders = await Order.findOne({ orderBy: id });
    // const findOrders = await Order.findOne({ orderBy: id }).populate("products.product").populate("orderBy").exec();
    const findOrders = await Order.find({ orderBy: id }).populate("products.product").populate("orderBy").exec();

    res.json(findOrders);
});

//TODO: CLASS 18

// Get Month wise all Orders

export const getMonthWiseOrdersController = asyncHandler(async (req, res) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // console.log('monthNames length -> ', monthNames.length);

    let dateToday = new Date();
    let endDate = "";
    dateToday.setDate(1);

    // console.log('dateToday -> ', dateToday);
    // console.log('dateToday Month -> ', dateToday.getMonth());

    // for (let i = 0; i < 11; i++) {
    for (let i = 0; i < monthNames.length; i++) {
        // console.log('dateToday IN FOR B Month -> ', dateToday.getMonth());
        dateToday.setMonth(dateToday.getMonth() - 1)
        // console.log('dateToday IN FOR A Month -> ', dateToday.getMonth());
        endDate = monthNames[dateToday.getMonth()] + " " + dateToday.getFullYear();
        // console.log('endDate -> ', endDate);
    };

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { month: "$month" },
                amount: { $sum: "$totalAfterDiscount" },
                count: { $sum: 1 }
            }
        }
    ]);

    res.json(data);
});

// Get Year wise all Orders

export const getYearlyOrdersController = asyncHandler(async (req, res) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // console.log('monthNames length -> ', monthNames.length);

    let dateToday = new Date();
    let endDate = "";
    dateToday.setDate(1);

    // console.log('dateToday -> ', dateToday);
    // console.log('dateToday Month -> ', dateToday.getMonth());

    // for (let i = 0; i < 11; i++) {
    for (let i = 0; i < monthNames.length; i++) {
    // for (let i = 0; i < 11; i++) {
        // console.log('dateToday IN FOR B Month -> ', dateToday.getMonth());
        dateToday.setMonth(dateToday.getMonth() - 1)
        // console.log('dateToday IN FOR A Month -> ', dateToday.getMonth());
        endDate = monthNames[dateToday.getMonth()] + " " + dateToday.getFullYear();
        // console.log('endDate -> ', endDate);
    };

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$totalAfterDiscount" }
            }
        }
    ]);

    res.json(data);
});

// Get single Order by Order ID // TODO: CLASS 18 i build this for my viewOrder.js

export const getSingleOrderByOrderIdController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);

    // const findOrders = await Order.findOne({ orderBy: _id });
    // const findOrders = await Order.findOne({ orderBy: _id }).populate("products.product").populate("orderBy").exec();
    const singleOrder = await Order.findById(id).populate("products.product");

        // .populate("orderBy").exec();

    res.json(singleOrder);
});

// Create User Cart // TODO: CLASS 08 i build this for my FOLLOWING userCartController

export const createUserCartController = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);

    // let products = [];

    // const user = await User.findById(_id);

    // check if user already have product in cart
    // const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    // if (alreadyExistCart) { alreadyExistCart.remove(); };

    // for (let i = 0; i < cart.length; i++) {
    //     let object = {};

    //     object.product = cart[i]._id;
    //     object.count = cart[i].count;
    //     object.color = cart[i].color;

    //     let getPrice = await Product.findById(cart[i]._id).select("price").exec();

    //     object.price = getPrice.price;
    //     products.push(object);
    // }

    // let cartTotal = 0;

    // for (let i = 0; i < products.length; i++) {
    //   cartTotal = cartTotal + products[i].price * products[i].count;
    // }

    let newCart = await new Cart({
        userId: _id,
        productId,
        color,
        quantity,
        price,
    }).save();

    res.json(newCart);
});

// Remove Product From Own Cart // TODO: CLASS 09

export const removeProductFromOwnCartController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // const { cartItemId } = req.body;
    const { cartItemId } = req.params;
    validateMongodbId(_id);

    const deletedOwnCart = await Cart.deleteOne({
        userId: _id,
        _id: cartItemId
    });

    if(!deletedOwnCart) throw new Error('Cart not found');

    res.json(deletedOwnCart);
});

// Update Product Quantity From Own Cart // TODO: CLASS 09 last part

export const updateProductQuantityFromOwnCartController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.body;
    // const { cartItemId, newQuantity } = req.params;
    // const { newQuantity } = req.body;
    validateMongodbId(_id);
    console.log('working');
    console.log('Product Quantity -> ', newQuantity);
    console.log('cartItemId -> ', cartItemId);

    const updatedProductQuantity = await Cart.findOne({
        userId: _id,
        _id: cartItemId
    });

    updatedProductQuantity.quantity = newQuantity;
    updatedProductQuantity.save();

    if(!updatedProductQuantity) throw new Error('Cart not found');

    res.json(updatedProductQuantity);
});

// Authenticate User Could Create a new Order

export const createNewOrderByAuthenticateUserController = asyncHandler(async (req, res) => {
    const { shippingInfo, paymentIntent, totalPrice, totalAfterDiscount, products } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);

    const order = await Order.create({
        shippingInfo,
        paymentIntent,
        totalPrice,
        totalAfterDiscount,
        products,
        orderBy: _id
    });

    res.json({ order, success: true});

    // if (!COD) throw new Error("Creating cash order failed");

    // const user = await User.findById(_id);

    // let userCart = await Cart.findOne({ orderBy: user._id });

    // // FINAL AMOUNT CALCULATION
    // let finalAmount = 0;

    // if (couponApplied && userCart.totalAfterDiscount) {
    //     finalAmount = userCart.totalAfterDiscount;
    // } else {
    //     finalAmount = userCart.cartTotal;
    // }

    // // GENERATE A NEW ORDER & SAVE TO DATABASE
    // let newOrder = await new Order({
    //      // TODO: AFTER CLASS 18
    //      // TODO: selected products only, but not for now
    //      // orderItems: userCart.products,
    //     products: userCart.products,
    //     totalPrice: userCart.cartTotal,
    //     totalAfterDiscount: finalAmount,
    //     // totalAfterDiscount: (couponApplied && userCart.totalAfterDiscount) ? userCart?.totalAfterDiscount : userCart?.totalPrice,
    //     paymentIntent: {
    //         id: uniqId(),
    //         method: "COD",
    //         amount: finalAmount,
    //         status: "Cash on Delivery",
    //         created: Date.now(),
    //         currency: "usd",
    //     },
    //     shippingInfo: {
    //         firstName: user?.firstName,
    //         lastName: user?.lastName,
    //         mobile: user?.mobile,
    //         email: user?.email
    //     },
    //     orderBy: user._id,
    //     orderStatus: "Cash on Delivery",
    // }).save();

    // // UPDATE PRODUCT MODEL FOR IT'S QUANTITY & SOLD
    // let update = userCart.products.map((item) => {
    //     return {
    //         updateOne: {
    //             filter: { _id: item.product._id },
    //             update: {
    //                 $inc: {
    //                     quantity: -item.count,
    //                     sold: +item.count
    //                 }
    //             },
    //         },
    //     };
    // });

    // const updated = await Product.bulkWrite(update, {});

    // // IT'S TIME TO DELETE THIS USER CART
    // if (updated) {
    //     console.log('userCart', userCart);
    //     // console.log('updated', updated);
    //     const preDelete = await Cart.findByIdAndDelete(userCart._id);
    //         // .remove().exec();
    //     res.json({ message: "success", preDelete });
    // };

    // res.json({ message: "success" });
});



