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
    const { projectId } = req.params;

    const project = await Project.findById(projectId)

    if(!project) {
        throw new ApiError(404, "Project not found")
    }

    const tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks fetched successfully"
            )
        )
});
const createTasks = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId)

    if(!project) {
        throw new ApiError(404, "Project not found")
    }

    const files = req.files || []

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        attachments,
        createdBy: req.user._id,
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id)
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                task,
                "Task created successfully"
            )
        )
});
const getTaskById = asyncHandler(async (req, res) => {
    //
});
const updateTask = asyncHandler(async (req, res) => {
    //
});
const deleteTasks = asyncHandler(async (req, res) => {
    //
});
const createSubTask = asyncHandler(async (req, res) => {
    //
});
const updateSubTask = asyncHandler(async (req, res) => {
    //
});
const deleteSubTask = asyncHandler(async (req, res) => {
    //
});

export {
    createTasks,
    getTasks,
    getTaskById,
    updateTask,
    deleteTasks,
    createSubTask,
    updateSubTask,
    deleteSubTask,
};
