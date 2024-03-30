import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
});

const Coupon = model('Coupon', couponSchema);

//Export the model
export default Coupon;