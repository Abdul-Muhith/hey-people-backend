import { Schema, model, Types } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const enquirySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
  },
},
    { timestamps: true }
);

const Enquiry = model('Enquiry', enquirySchema);

//Export the model
export default Enquiry;