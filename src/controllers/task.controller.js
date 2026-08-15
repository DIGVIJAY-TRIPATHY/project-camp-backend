import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableTaskStatuses } from "../utils/constants.js";

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

    // Use the filename multer actually wrote to disk (Date.now()-prefixed),
    // not the client's original filename, or the URL will 404.
    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.filename}`,
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
    const { taskId } = req.params

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            _id:1,
                            avatar: 1,
                            username: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtask",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        avatar: 1,
                                        username: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0]
                }
            }
        }
    ])

    if(!task || task.length === 0) {
        throw new ApiError(404, "Task not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task[0],
                "Task fetched successfully"
            )
        )
});
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    if (status && !AvailableTaskStatuses.includes(status)) {
        throw new ApiError(400, "Invalid task status");
    }

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
        throw new ApiError(404, "Task not found");
    }

    const files = req.files || [];

    const newAttachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
        };
    });

    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            title,
            description,
            assignedTo: assignedTo
                ? new mongoose.Types.ObjectId(assignedTo)
                : existingTask.assignedTo,
            status,
            // keep existing attachments and append any newly uploaded ones
            attachments: [...existingTask.attachments, ...newAttachments],
        },
        {
            new: true,
        },
    );

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTasks = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // remove all subtasks that belong to this task first
    await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subTask = await Subtask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        createdBy: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, subTask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
    const { title, isCompleted } = req.body;

    const subTask = await Subtask.findById(subTaskId);

    if (!subTask) {
        throw new ApiError(404, "Subtask not found");
    }

    const updatedSubTask = await Subtask.findByIdAndUpdate(
        subTaskId,
        {
            title: title ?? subTask.title,
            isCompleted:
                typeof isCompleted === "boolean"
                    ? isCompleted
                    : subTask.isCompleted,
        },
        {
            new: true,
        },
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedSubTask, "Subtask updated successfully"),
        );
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;

    const subTask = await Subtask.findById(subTaskId);

    if (!subTask) {
        throw new ApiError(404, "Subtask not found");
    }

    await Subtask.findByIdAndDelete(subTaskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
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