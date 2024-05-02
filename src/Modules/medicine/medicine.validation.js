import Joi from "joi";


const addMedicineValidation = Joi.object({
    name: Joi.string().min(1).max(500).required().trim(),
    description: Joi.string().min(10).max(500).required().trim(),
    quantity: Joi.number().min(1).required(),
    images: Joi.array().items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/svg', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }).required()),
    categoryId: Joi.string().hex().max(24).required(),
    expiryDate: Joi.date().required(),


}).required()

const updateMedicineValidation = Joi.object({

    name: Joi.string().min(1).max(500).optional().trim(),
    description: Joi.string().min(10).max(500).optional().trim(),
    quantity: Joi.number().min(1).optional(),
    images: Joi.array().items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/svg', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }).optional()),
    categoryId: Joi.string().hex().max(24).optional(),
    expiryDate: Joi.date().optional(),

}).required()

const paramsIdValidation = Joi.object({
    id: Joi.string().hex().max(24).required()
}).required()

export {
    addMedicineValidation,
    updateMedicineValidation,
    paramsIdValidation
}