import { Schema, model, Types } from 'mongoose'; // Erase if already required

import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Declare the Schema of the Mongo model
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Array, // পরে যোগ করা হয়েছে
        default: 'user',
        // enum: ['admin', 'user', 'student'],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        // type: Types.ObjectId,
        // ref: "Address"
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    { timestamps: true }
);

// Hashing Password

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Matched password

userSchema.methods.isPasswordMatched = async function (enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create Password Reset Token

userSchema.methods.createPasswordResetToken = async function () { 
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = model('User', userSchema);

//Export the model
export default User;