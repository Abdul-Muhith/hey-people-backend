import asyncHandler from 'express-async-handler';

import Enquiry from '../models/enquiryModel.js';

import validateMongodbId from '../utils/validateMongodbId.js';

// create a new Enquiry

export const createNewEnquiryController = asyncHandler(async (req, res) => {
    const newEnquiry = await Enquiry.create(req.body);

    if (!newEnquiry) throw new Error("Couldn't create a new Enquiry");

    res.json(newEnquiry);
});

// Update a Enquiry with ID

export const updateEnquiryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEnquiry) throw new Error("Couldn't update");

    res.json(updatedEnquiry);
});

// Delete a single Enquiry

export const deleteEnquiryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) throw new Error("Couldn't find Enquiry with this id");

    res.json(deletedEnquiry);
});

// Get a single Enquiry

export const getSingleEnquiryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const singleEnquiry = await Enquiry.findById(id);

    if (!singleEnquiry) throw new Error("Not found minimum Enquiry with ID");

    res.json(singleEnquiry);
});

// Get all Enquirys

export const getAllEnquiriesController = asyncHandler(async (req, res) => {
    const getAllEnquirys = await Enquiry.find();

    if (!getAllEnquirys) throw new Error("Data not found");

    res.json(getAllEnquirys);
});