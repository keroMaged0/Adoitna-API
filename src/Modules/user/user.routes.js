import { Router } from "express";

import * as authController from '../auth/auth.controller.js'
import * as userValidation from './user.validation.js'

import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { endPointRoles } from "./user.endPoint.js";
import userController from "./user.controller.js";

const router = Router();

//=================================== Get User Profile Data router ===================================//
router.get('/:id',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    userController.getUserProfile
)

//=================================== Get All User Profile Data router ===================================//
router.get('/All/Users',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    userController.getAllUserProfile
)

//=================================== Get All Deleted User router ===================================//
router.get('/All/Deleted/User',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    userController.getAllDeletedUser
)

//=================================== update User Data router ===================================//
router.put('/',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    validationMiddleware(userValidation.updateUserValidation),
    userController.updateUserData
)

//=================================== changePassword router ===================================//
router.patch('/changePassword',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    validationMiddleware(userValidation.changePasswordValidation),
    userController.changePassword
)

//=================================== delete User Account router ===================================//
router.put('/Delete/:id',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    validationMiddleware(userValidation.deleteUserValidation),
    userController.deleteUserAccount
)

//=================================== Forget Password Router  ===================================//
router.post('/forgetPassword',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    validationMiddleware(userValidation.forgetPasswordValidation),
    userController.forgetPassword
)

//=================================== Password Reset router ===================================//
router.get('/resetPassword/:token',
    authController.protectedRoute(endPointRoles.FORGET_PASSWORD),
    validationMiddleware(userValidation.resetPasswordValidation),
    userController.resetPassword
)









export default router;