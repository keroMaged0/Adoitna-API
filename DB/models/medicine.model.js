import mongoose, { Schema, model } from "mongoose";


const medicineSchema = new Schema({
    /** String */
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: [1, 'too short medicine name'],
        maxlength: [500, 'too short medicine name'],
    },
    slug: {
        type: String,
        lowercase: true,
        // required: true,
    },
    description: {
        type: String,
        trim: true,
        minlength: [10, 'too short product name'],
        maxlength: [500, 'too short product name'],
    },
    folderId: {
        type: String,
        required: true,
        unique: true
    },

    /** Number */
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
   
    /** Arrays */
    Images: [{
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true }
    }],

    /** ObjectIds */
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    /** Date */
    expiryDate: {
        type: Date,
        required: true
    },
 
}, { timestamps: true })


// productSchema.pre('find', function () {
//     this.populate('category')

// })

export default mongoose.models.Medicine || model('Medicine', medicineSchema)