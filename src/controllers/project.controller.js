import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProjects = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const getProjectById = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const createProject = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const updateProject = asyncHandler(async (requestAnimationFrame, res) => {
    //
});

const deleteProject = asyncHandler(async (requestAnimationFrame, res) => {
    //
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