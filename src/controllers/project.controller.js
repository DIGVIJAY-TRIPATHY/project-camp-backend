import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (requestAnimationFrame, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
            }
        },
        {
            $lookup: {
                from: "projects",
                localfield: "projects",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "projects",
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            $size: "$projectmembers"
                        }
                    }
                ]
            }
        },
        {
            $unwind: "project"
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                members: 1,
                createdAt: 1,
                createdBy: 1
            },
            role: 1,
            _id: 0,
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projects,
                "Projects fetched successfully"
            )
        )
});

const getProjectById = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const createProject = asyncHandler(async (requestAnimationFrame, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        Project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                project,
                "Project created successfully"
            )
        )
});

const updateProject = asyncHandler(async (requestAnimationFrame, res) => {
    const { name, description } = req.body;
    const {projectId} = req.params

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        {
            new: true
        }   
    )

    if(!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project updated successfully"
            )
        )

});

const deleteProject = asyncHandler(async (requestAnimationFrame, res) => {
    const {projectId} = req.params

    const project = await Project.findByIdAndDelete(projectId)

    if(!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project deleted successfully"
            )
        )
});

const addMembersToProject = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const getProjectMembers = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const updateMemberRole = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const deleteMember = asyncHandler(async (requestAnimationFrame, res) => {
    //
});



export {
    addMembersToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjects,
    getProjectById,
    getProjectMembers,
    updateMemberRole,
    updateProject
}