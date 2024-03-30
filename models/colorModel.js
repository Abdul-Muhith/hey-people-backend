import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const colorSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
},
    { timestamps: true }
);

const Color = model('Color', colorSchema);

//Export the model
export default Color;