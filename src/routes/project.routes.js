import { Router } from "express";
import {
    addMembersToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjects,
    getProjectById,
    getProjectMembers,
    updateMemberRole,
    updateProject
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    createProjectValidator,
    addMemberToProjectValidator
} from "../validators/index.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { ProjectMember } from "../models/projectmember.model.js";

const router = Router();

route.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
    );

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMembersToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteMember
    )
updateMemberRole
    

export default router;