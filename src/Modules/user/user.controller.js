import userModel from "../../../DB/models/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { catchError } from "../../Middleware/global-response.middleware.js";
import { sendEmail } from "../../Service/Email/sendEmail.js";
import { appError } from "../../Utils/app.Error.js";

//=================================== Get User Profile Data controller ===================================//  (done)
/* 
    * destruct required data
    * find user model
    * return error if user is not found
    * return success and date  if user 
*/
const getUserProfile = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { id } = req.params

        // find user model
        let userData = await userModel.findOne({ _id: id, isDeleted: false })
        if (!userData) return next(new appError('!not found user', 401))

        if (userData._id.toString() !== _id.toString()) return next(new appError('! not authorized to join', 401))

        res.json({ success: true, message: "User profile found successfully", data: userData })
    }
)

//=================================== Get All User Profile Data controller ===================================//  (done)
/* 
    * find user model
    * return error if user is not found
    * return success and date  if user 
*/
const getAllUserProfile = catchError(
    async (req, res, next) => {
        // find user model
        let userData = await userModel.find()
        console.log(userData);
        if (!userData) return next(new appError('!not found user', 401))

        res.json({ success: true, message: "User profile found successfully", data: userData })
    }
)

//=================================== Get All Deleted User controller ===================================// (done)
/* 
    * find user isDeleted 
*/
const getAllDeletedUser = catchError(
    async (req, res, next) => {

        // find user isDeleted 
        const deletedUser = await userModel.find({ isDeleted: true })
        if (!deletedUser) return next(new appError("User not found", 404))

        res.json({ success: true, message: "successfully", data: deletedUser })
    }
)

//=================================== update User Profile Data controller ===================================//  (done)
/*
    * destruct required data
    * check unique email and phone number
    * find user model and update user profile
*/
const updateUserData = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { name, email } = req.body

        // check if user found
        const user = await userModel.findOne({ _id: _id, isDeleted: false })
        if (!user) return next(new appError('!not found user', 401))

        if (name) {
            if (user.name.toString() == name) return next(new appError('name already used please change and try again ', 404))
            user.name = name
        }

        if (email) {
            // get all users 
            const users = await userModel.find({ isDeleted: false })
            if (!users) return next(new appError('!not found user', 401))

            users.map(user => {
                // check unique email
                if (user.email.toString() == email) return next(new appError('email already used please change and try again ', 404))
            })

            user.email = email
            user.EmailVerified = false
            user.loggedIn = false

            // send email
            sendEmail({ email: email, type: 'updateEmail', req: req })
        }

        await user.save()

        res.json({ success: true, message: "User profile updated successfully", data: user })
    }
)

//=================================== changePassword controller ===================================// (done)
/* 
* destruct required data  
* find if found user
* check if password valid
* create token
*/
const changePassword = catchError(
    async (req, res, next) => {
        // destruct required data
        const { oldPassword, newPassword } = req.body
        const { _id } = req.user

        //  check if auth user
        let user = await userModel.findById(_id)

        // if !not found user
        if (!user) return next(new appError('!not found user', 401))

        // if found id and password in body match password in user token
        if (user && bcrypt.compareSync(oldPassword, user.password, +process.env.SALT_ROUND)) {
            // create new token  
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.CHANGE_PASSWORD_SIGNATURE)

            // find user by id and update old password to new password 
            await userModel.findByIdAndUpdate(user._id, { password: newPassword, changePasswordTime: Date.now() })

            return res.json({ success: true, message: "password change successfully", data: token })
        }

        return res.json({ success: false, message: "!not valid old password please try again" })


    }
)

//=================================== Delete User Account soft delete controller ===================================// (done)
/*
    * destruct data to params  
    * check if user and soft delete
*/
const deleteUserAccount = catchError(
    async (req, res, next) => {
        // destruct data to params 
        const { id } = req.params

        // find user by id and soft delete 
        const deletedUser = await userModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true })
        if (!deletedUser) return next(new appError("User not found", 404))

        res.json({ success: true, message: "User account deleted successfully" })
    }
)


//=================================== Forget Password Controller ===================================// (done) 
/*
    * destruct required data
    * check if user auth
    * check if email send body match email user  
*/
const forgetPassword = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { email } = req.body

        // check if user found
        let user = await userModel.findOne({ _id: _id, isDeleted: false })
        if (!user) return next(new appError('!not found user', 401))

        // check if email send body match email user 
        if (user.email.toString() !== email) return next(new appError('not found email please try agin', 404))

        // send email
        sendEmail({ email: email, type: 'forgetPassword', req: req })

        res.json({ success: true, message: "password reset link sent to your email" })
    }
)

//=================================== Reset Password Controller ===================================// (done)
/*
    * destruct data from query
    * decode token
    * find by email
    * find user and update 
*/
const resetPassword = catchError(
    async (req, res, next) => {
        // destruct data from query
        const { token } = req.params
        const { newPassword } = req.body

        // decode token and check
        jwt.verify(token, process.env.JWT_SECRET_LOGIN, async (err, decoded) => {

            if (err) return next(new appError(err, 400))

            // find user model and update
            let user = await userModel.findOneAndUpdate({
                email: decoded.email
            }, {
                resetPassword: true,
                password: newPassword

            }, { new: true })

            res.json({ success: true, message: "done update password now", user })
        })


    }
)



export default {
    getUserProfile,
    getAllUserProfile,
    getAllDeletedUser,
    updateUserData,
    changePassword,
    forgetPassword,
    deleteUserAccount,
    resetPassword
}