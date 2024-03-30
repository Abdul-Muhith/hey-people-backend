import { Schema, Types, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        // type: Schema.Types.ObjectId,
        // ref: 'Category',
        type: String,
        required: true,
    },
    brand: {
        type:String,
        // enum: ['Apple', 'Samsung', 'Lenovo'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        // select: false,
    },
    sold: {
        type: Number,
        default: 0,
        // select: false,
    },
    // images: {
    //     type: Array,
    // },
    // CLASS 08 LAST TIME
    // images: [],
    images: [
        {
            public_id: String,
            url: String,
        },
    ],
    // FROM CLASS TWO
    // color: {
    //     type: String,
    //     // enum: ['Black', 'Brown', 'Red'],
    //     required: true,
    // },
    // TODO: amr kora kaj eta
    // color: [],
    // TODO: unr kora kaj eta
    color: [
        {
            type: Types.ObjectId,
            ref: "Color"
        }
    ],
    // color: [
    //     {
    //         id: String,
    //         color: String,
    //     }
    // ],
    // AFTER CLASS 09
    // tags: [],
    tags: String,
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: {
                type: Types.ObjectId,
                ref: "User"
            },
        }
    ],
    totalRating: {
        type: String,
        default: 0,
    },
},
    { timestamps: true }
);

const Product = model('Product', productSchema);

//Export the model
export default Product;