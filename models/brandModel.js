import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const brandSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
},
    { timestamps: true }
);

const Brand = model('Brand', brandSchema);

//Export the model
export default Brand;