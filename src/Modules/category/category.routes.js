import { Router } from "express";

import * as categoryController from './category.controller.js';
import * as authController from '../auth/auth.controller.js';
import { endPointRoles } from "./category.endPoint.js";
import * as categoryValidation from './category.validation.js';

import { multerMiddleHost } from "../../Middleware/multer.js";
import { allowedExtensions } from "../../Utils/allowed-extensions.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";



const router = Router();


//=================================== Add category router ===================================//   
router.post('/',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    multerMiddleHost(
        { extensions: allowedExtensions.image }
    ).single('image'),
    validationMiddleware(categoryValidation.addCategoryValidation),
    categoryController.addCategory
)

//=================================== update category router ===================================//  
router.put('/:id',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    multerMiddleHost(
        { extensions: allowedExtensions.image }
    ).single('image'),
    validationMiddleware(categoryValidation.updateCategoryValidation),
    categoryController.updateCategory
)

//=================================== delete category router ===================================//  
router.delete('/:id',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    validationMiddleware(categoryValidation.categoryIdParams),
    categoryController.deleteCategory
)

//=================================== get All category router ===================================//  
router.get('/',
    categoryController.getAllCategory
)

//=================================== get specific category router ===================================//  
router.get('/:id',
    validationMiddleware(categoryValidation.categoryIdParams),
    categoryController.getSpecificCategory
)



export default router;