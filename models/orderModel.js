import { Schema, model, Types } from 'mongoose'; // Erase if already required
// TODO: CLASS 18 কাজ করতে দেখিনি কিন্তু উনার ডাটাবেজের compas দেখতে পাইছি। ____ 11 নাম্বার ক্লাসে পাইছি।

// Declare the Schema of the Mongo model
const orderSchema = new Schema({
    // TODO: AFTER CLASS 18
    products: [
    // orderItems: [
        {
            product: {
                type: Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
        },
    ],
     // TODO: AFTER CLASS 18
    month: {
        type: String,
        default: new Date().getMonth(),
    },
    totalPrice: Number,
    totalAfterDiscount: Number,
    shippingInfo: {},
    paidAt: String,
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Ordered",
        enum: [
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
            "Ordered",
        ]
    },
    orderBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
},
    { timestamps: true }
);

const Order = model('Order', orderSchema);

//Export the model
export default Order;





// TODO: Design Stage

// import { Schema, model, Types } from 'mongoose'; // Erase if already required
//     // TODO: CLASS 18 কাজ করতে দেখিনি কিন্তু উনার ডাটাবেজের compas দেখতে পাইছি।

// // Declare the Schema of the Mongo model
// const orderSchema = new Schema({
//     // TODO: AFTER CLASS 18
//     products: [
//     // orderItems: [
//         {
//             product: {
//                 type: Types.ObjectId,
//                 ref: "Product"
//             },
//             count: Number,
//             color: String,
//         },
//     ],
//      // TODO: AFTER CLASS 18
//     month: {
//         type: String,
//         default: new Date().getMonth(),
//     },
//     totalPrice: Number,
//     totalAfterDiscount: Number,
//     shippingInfo: {},
//     paidAt: String,
//     paymentIntent: {},
//     orderStatus: {
//         type: String,
//         default: "Not Processed",
//         enum: [
//             "Not Processed",
//             "Cash on Delivery",
//             "Processing",
//             "Dispatched",
//             "Cancelled",
//             "Delivered",
//         ]
//     },
//     orderBy: {
//         type: Types.ObjectId,
//         ref: 'User',
//     },
// },
//     { timestamps: true }
// );

// const Order = model('Order', orderSchema);

// //Export the model
// export default Order;