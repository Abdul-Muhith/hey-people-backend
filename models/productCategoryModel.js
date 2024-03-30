import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const productCategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
},
    { timestamps: true }
);

const ProductCategory = model('ProductCategory', productCategorySchema);

//Export the model
export default ProductCategory;