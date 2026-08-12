import { body } from "express-validator";
import {AvailableUserRole} from "../utils/constants.js"

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
        body("fullName")
            .optional()
            .trim()
    ];
};

const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
            .notEmpty()
            .trim()
            .withMessage("Old password is required"),
        body("newPassword")
            .notEmpty()
            .trim()
            .withMessage("New password is required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .notEmpty()
            .trim()
            .withMessage("Password is required")
    ]
}

const createProjectValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Project name is required"),
        body("description")
            .optional()
            .trim()
    ]
}

const addMemberToProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("role")
            .trim()
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRole)
            .withMessage("Role is invalid")
    ]
}

export { 
    userRegisterValidator, 
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator
};
