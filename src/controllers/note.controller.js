import { Project } from "../models/project.model.js";
import { ProjectNote } from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId),
    }).populate("createdBy", "avatar username fullName");

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findById(noteId).populate(
        "createdBy",
        "avatar username fullName",
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        content,
        createdBy: req.user._id,
    });

    const populatedNote = await ProjectNote.findById(note._id).populate(
        "createdBy",
        "avatar username fullName",
    );

    return res
        .status(201)
        .json(new ApiResponse(201, populatedNote, "Note created successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    const note = await ProjectNote.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    const updatedNote = await ProjectNote.findByIdAndUpdate(
        noteId,
        { content },
        { new: true },
    ).populate("createdBy", "avatar username fullName");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    await ProjectNote.findByIdAndDelete(noteId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export { getNotes, getNoteById, createNote, updateNote, deleteNote };
