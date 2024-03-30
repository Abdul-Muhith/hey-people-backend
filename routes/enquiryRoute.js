import express from 'express';

import {
    createNewEnquiryController,
    deleteEnquiryController,
    getAllEnquiriesController,
    getSingleEnquiryController,
    updateEnquiryController,
} from '../controllers/enquiryController.js';

import {
    authMiddleware,
    isAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createNewEnquiryController);
router.put('/:id', updateEnquiryController);
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiryController);

router.get('/', getAllEnquiriesController);
router.get('/:id', getSingleEnquiryController);

export default router;