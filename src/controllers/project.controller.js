import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
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

const getProjectById = asyncHandler(async (req, res) => {
    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project fetched successfully"
            )
        )
    
});

const createProject = asyncHandler(async (req, res) => {
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

const updateProject = asyncHandler(async (req, res) => {
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

const deleteProject = asyncHandler(async (req, res) => {
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

const addMembersToProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const {email, role} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User not found")
    }

    await ProjectMember.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true,
            upsert: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Member added successfully"
            )
        )
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(req.params)

    if(!project){
        throw new ApiError(404, "Project not found")
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1,
                            fullname: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElementAt: ["$user", 0]
                }
            }
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                "Project members fetched successfully"
            )
        )
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params
    const {newRole} = req.body

    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400, "Invalid role")
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })
    if(!projectMember){
        throw new ApiError(400, "project member not found")
    }

    projectMember = await projectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole
        },
        {
            new: true
        }
    )

    if(!projectMember){
        throw new ApiError(400, "project member not found")
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Member role updated successfully"
            )
        )
    
});

const deleteMember = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })

    if(!projectMember){
        throw new ApiError(400, "project member not found")
    }

    projectMember = await projectMember.findByIdAndDelete(ProjectMember._id)

    if(!projectMember){
        throw new ApiError(400, "project member not found")
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "project Member deleted successfully"
            )
        )
    
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