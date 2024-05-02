import { Router } from "express";

import * as productController from './medicine.controller.js';
import * as medicineValidation from './medicine.validation.js';
import * as authController from '../auth/auth.controller.js';

import { endPointRoles } from "./medicine.endPoint.js";
import { multerMiddleHost } from "../../Middleware/multer.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";


const router = Router();

//=================================== Create Medicine Router ===================================//
router.post('/',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    multerMiddleHost(
        { extensions: allowedExtensions.image }
    ).array('Images'),
    validationMiddleware(medicineValidation.addMedicineValidation),
    productController.createMedicineController
)

//=================================== Update Medicine Router ===================================//
router.put('/:id',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    multerMiddleHost(
        { extensions: allowedExtensions.image }
    ).single('image'),
    validationMiddleware(medicineValidation.updateMedicineValidation),
    productController.updateMedicineController
)

//=================================== Delete Medicine By User router ===================================//
router.delete('/byUser/:id',
    authController.protectedRoute(endPointRoles.USER_ROLES),
    validationMiddleware(medicineValidation.paramsIdValidation),
    productController.deleteMedicineByUserController
)


//=================================== Delete Medicine By Admin router ===================================//

router.delete('/byAdmin/:id',
    authController.protectedRoute(endPointRoles.ADMIN_ROLES),
    validationMiddleware(medicineValidation.paramsIdValidation),
    productController.deleteMedicineByAdminController
)

//=================================== Get All Medicine router ===================================//
router.get('/',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    productController.getAllMedicineController
)

//=================================== Get Specific Medicine router ===================================//
router.get('/:id',
    authController.protectedRoute(endPointRoles.ALL_ACCESS),
    validationMiddleware(medicineValidation.paramsIdValidation),
    productController.updateMedicineController
)

export default router;