import asyncHandler from 'express-async-handler';

import slugify from 'slugify';

import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Create a new product

export const createProductController = asyncHandler(async (req, res) => {
    // res.json('Hey, it is product post controller');

    if (req.body.title) req.body.slug = slugify(req.body.title);

    const newProduct = await Product.create(req.body);

    if (!newProduct) throw new Error('Could not create product');

    res.json(newProduct);
});

// Update a Product with ID

export const updateProductController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.body.title) req.body.slug = slugify(req.body.title);

    const updateProduct = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    res.json(updateProduct);
});

// Delete product

export const deleteProductController = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const deleteProduct = await Product.findByIdAndDelete(id);

    res.json(deleteProduct);
});

// Get a single Product

export const getASingleProductController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // const findProduct = await Product.findById(id);
    // TODO: CLASS 08
    const findProduct = await Product.findById(id).populate('color');

    if (!findProduct) {
        throw new Error("Product not Found");
    }

    res.json(findProduct);
});

/**
 * Get all Product
 * filtering
 * sorting
 * limiting products fields
 * pagination
 */

export const getAllProductsController = asyncHandler(async (req, res) => {
    // const findProduct = await Product.find()
    // const findProduct = await Product.find(req.query);
    // const findProduct = await Product.find({
    //     brand: req.query.brand,
    //     category: req.query.category,
    // });

    // const findProduct = await Product.where("category").equals(req.query.category);

    // if (!findProduct) {
        // throw new Error("Product not Found");
    // }

    // res.json(findProduct);

    /**
     * FILTERING PRODUCT
     */

    const queryObj = { ...req.query };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // console.log(queryObj, excludeFields);

    // const excludeFields2 = excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, excludeFields2);

    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, excludeFields);

    let queryStr = JSON.stringify(queryObj);
    // console.log(queryObj, queryStr);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr, JSON.parse(queryStr));

    let query = Product.find(JSON.parse(queryStr));

    /**
    * SORTING PRODUCT
    */

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // query = query.sort('category brand');

        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    /**
    * LIMITING PRODUCTS FIELDS
    */

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        // query = query.fields('title price category');

        query = query.select(fields);
    } else {
        query = query.select("-__v");
    }

    /**
    * PAGINATION
    */

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    // console.log(page, limit, skip);
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
    }

    const findProducts = await query;

    if (!findProducts) {
        throw new Error("Product not Found");
    }

    res.json(findProducts);
});

// Add product to wishList

export const addToWishlistController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;

    const user = await User.findById(_id);

    if (!user) throw new Error("User not found");

    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyAdded) {
        let user = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: prodId } },
            { new: true, }
        );
        res.json(user);
    } else {
        let user = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: prodId } },
            { new: true }
        );
        res.json(user);
    };
});

// Rate the product

export const ratingProductController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;

    const product = await Product.findById(prodId);

    if (!product) throw new Error("Product not found");

    const alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());

    if (alreadyRated) {
        const updateRating = await Product.updateOne(
            { ratings: { $elemMatch: alreadyRated } },
            { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
            { new: true }
        );
        // res.json(updateRating);
    } else {
        const rateProduct = await Product.findByIdAndUpdate(
            prodId,
            { $push: { ratings: { star: star, comment: comment, postedBy: _id } } },
            { new: true }
        );
        // res.json(rateProduct);
    };

    const getAllRatings = await Product.findById(prodId);

    let totalRatingCount = getAllRatings.ratings.length;

    let ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);

    let actualRating = Math.round(ratingSum / totalRatingCount);

    let finalProduct = await Product.findByIdAndUpdate(
        prodId,
        { totalRating: actualRating },
        { new: true }
    );
    res.json(finalProduct);
});

// Get all ratings

// export const getAllRatingsController = asyncHandler(async (req, res) => { });