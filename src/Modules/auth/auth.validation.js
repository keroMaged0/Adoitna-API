import Joi from "joi"

const SignUpValidations = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(20).lowercase().required(),
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        role: Joi.string()
    })
}

const SignInValidations = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    })
}


export {
    SignUpValidations,
    SignInValidations
}