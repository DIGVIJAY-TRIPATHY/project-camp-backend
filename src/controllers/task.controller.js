import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const getTasks = asyncHandler(async (req, res) => {
    //
})
const createTasks = asyncHandler(async (req, res) => {
    //
})
const getTaskById = asyncHandler(async (req, res) => {
    //
})
const updateTask = asyncHandler(async (req, res) => {
    //
})
const deleteTasks = asyncHandler(async (req, res) => {
    //
})
const createSubTask = asyncHandler(async (req, res) => {
    //
})
const updateSubTask = asyncHandler(async (req, res) => {
    //
})
const deleteSubTask = asyncHandler(async (req, res) => {
    //
})


export {
    createTasks,
    getTasks,
    getTaskById,
    updateTask,
    deleteTasks,
    createSubTask,
    updateSubTask,
    deleteSubTask
}