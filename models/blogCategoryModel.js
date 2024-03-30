import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const blogCategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
},
    { timestamps: true }
);

const BlogCategory = model('BlogCategory', blogCategorySchema);

//Export the model
export default BlogCategory;