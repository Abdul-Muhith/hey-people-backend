import express from 'express';

import authRoutes from './authRoute.js';
import productRoutes from './productRoute.js';
import blogRoutes from './blogRoute.js';
import productCategoryRoutes from './productCategoryRoute.js';
import blogCategoryRoutes from './blogCategoryRoute.js';
import brandRoutes from './brandRoute.js';
import couponRoutes from './couponRoute.js';
import uploadRoutes from './uploadRoute.js';
import colorRoutes from './colorRoute.js';
import enquiryRoutes from './enquiryRoute.js';

const router = express.Router();

router.use('/api/v1/user', authRoutes);
router.use('/api/v1/product', productRoutes);
router.use('/api/v1/blog', blogRoutes);
router.use('/api/v1/product-category', productCategoryRoutes);
router.use('/api/v1/blog-category', blogCategoryRoutes);
router.use('/api/v1/brand', brandRoutes);
router.use('/api/v1/coupon', couponRoutes);
router.use('/api/v1/upload', uploadRoutes);
router.use('/api/v1/color', colorRoutes);
router.use('/api/v1/enquiry', enquiryRoutes);

router.get('/', (_req, res, _next) => {
    console.log('Hello World');
    res.send('Hello World');
});

router.get('*', (_, res) => {
    res.send('Thank You for your Request')
})

export default router;