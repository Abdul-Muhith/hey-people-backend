import asyncHandler from 'express-async-handler';

import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

import validateMongodbId from '../utils/validateMongodbId.js';

// Create a new blog

export const createBlogController = asyncHandler(async (req, res) => {
    const newBlog = await Blog.create(req.body);

    if (!newBlog) throw new Error("Couldn't create a new blog");

    res.json(newBlog);
});

// Update blog by id

export const updateBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedBlog) throw new Error("Couldn't update your blog");

    res.json(updatedBlog);
});

// Get a single blog

export const singleBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleBlog = await Blog.findById(id).populate('likes').populate('dislikes');

    if (!singleBlog) throw new Error("Couldn't find a blog with id");

    const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
            $inc: { numViews: 1 },
        },
        { new: true }
    );

    res.json(singleBlog);
});

// find all blog 

export const getAllBlogsController = asyncHandler(async (req, res) => {
    const allBlogs = await Blog.find();

    if (!allBlogs) throw new Error('No blog found');
    
    res.json(allBlogs);
});

// Delete a single blog by id

export const deleteBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleBlog = await Blog.findById(id);

    if (!singleBlog) throw new Error("Couldn't find a blog with id");

    const deleteBlog = await Blog.findByIdAndDelete(id);

    res.json(deleteBlog);
});

// Like Blog

export const likeBlogController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    // find the login user
    const loginUserId = req?.user?._id;

    if (!loginUserId) throw new Error(`you haven't authenticated User`); // নতুন যোগ করা কাজ এটি

    // find if the user has liked the blog
    const isLiked = blog?.isLiked;

    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );

        res.json(blog);
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );

        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );

        res.json(blog);
    }
});

// Dislike Blog

export const disLikeBlogController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    // find the login user
    const loginUserId = req?.user?._id;

    if (!loginUserId) throw new Error(`you haven't authenticated User`); // নতুন যোগ করা কাজ এটি

    // find if the user has disliked the blog
    const isDisliked = blog?.isDisliked;

    // find if the user has liked the blog
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());

    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );

        res.json(blog);
    }

    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );

        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );

        res.json(blog);
    }
});