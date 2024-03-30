import { Schema, model, Types } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: Types.ObjectId,
        ref: 'Color',
    },
    cartTotal: Number,
    totalAfterDiscount: Number,
},
    { timestamps: true }
);

const Cart = model('Cart', cartSchema);

//Export the model
export default Cart;



// TODO: Design Stage
// import { Schema, model, Types } from 'mongoose'; // Erase if already required

// // Declare the Schema of the Mongo model
// const cartSchema = new Schema({
//     products: [
//         {
//             product: {
//                 type: Types.ObjectId,
//                 ref: "Product"
//             },
//             count: Number,
//             color: String,
//             price: Number,
//         },
//     ],
//     cartTotal: Number,
//     totalAfterDiscount: Number,
//     orderBy: {
//         type: Types.ObjectId,
//         ref: 'User',
//     },
// },
//     { timestamps: true }
// );

// const Cart = model('Cart', cartSchema);

// //Export the model
// export default Cart;


