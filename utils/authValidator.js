import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        password: passwordComplexity().required().label("password"),

    })
    return schema.validate(body)
}

export const logInBodyValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        password: Joi.string().required().label("password"),
        fcmToken: Joi.string().required().label("fcmToken")
    })

    return schema.validate(body)
}

export const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};