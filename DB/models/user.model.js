import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { systemRoles } from "../../src/Utils/system-roles.js";



//============================== create the user schema ==============================//
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'too short user name'],
        maxlength: [20, 'too short user name'],
        lowercase: true
    },
    email: {
        type: String,
        unique: [true, 'email is required'],
        trim: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [systemRoles.ADMIN, systemRoles.DONATION, systemRoles.PATENT, systemRoles.USER],
        default: systemRoles.USER
    },
    EmailVerified: {
        type: Boolean,
        default: false,
    },
    loggedIn: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        type: Boolean,
        default: false
    },
    changePasswordTime: Date,

}, { timestamps: true })

// hash password pre save
userSchema.pre('save', function () {
    if (this.password) this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS)
})


userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, +process.env.SALT_ROUNDS)
})

userSchema.pre('findOne', function () {
    if (this._conditions.password)
        this._conditions.password = bcrypt.hashSync(this._conditions.password, +process.env.SALT_ROUNDS);

});
export default mongoose.models.User || mongoose.model('User', userSchema)

