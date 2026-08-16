import { body } from "express-validator";
import {AvailableUserRole, AvailableTaskStatuses} from "../utils/constants.js"

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

const createTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Task title is required"),
        body("description")
            .optional()
            .trim(),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Assigned user id is invalid"),
        body("status")
            .optional()
            .isIn(AvailableTaskStatuses)
            .withMessage("Task status is invalid"),
    ]
}

const updateTaskValidator = () => {
    return [
        body("title")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Task title cannot be empty"),
        body("description")
            .optional()
            .trim(),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Assigned user id is invalid"),
        body("status")
            .optional()
            .isIn(AvailableTaskStatuses)
            .withMessage("Task status is invalid"),
    ]
}

const createSubTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Subtask title is required"),
    ]
}

const updateSubTaskValidator = () => {
    return [
        body("title")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Subtask title cannot be empty"),
        body("isCompleted")
            .optional()
            .isBoolean()
            .withMessage("isCompleted must be a boolean"),
    ]
}

const createNoteValidator = () => {
    return [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Note content is required"),
    ]
}

const updateNoteValidator = () => {
    return [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Note content is required"),
    ]
}

export { 
    userRegisterValidator, 
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator,
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator,
    createNoteValidator,
    updateNoteValidator,
};
