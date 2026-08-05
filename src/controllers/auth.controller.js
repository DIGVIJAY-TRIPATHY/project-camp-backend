import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {sendEmail} from "../utils/mail.js";
import {emailVerificationMailgenContent} from "../utils/mail.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens");
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    });

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail(
        {
            email: user?.email,
            subject: "Email Verification",
            mailgenContent: emailVerificationMailgenContent(
                user?.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            ),
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "User registered successfully. Please check your email to verify your account.",
                createdUser
            )
        );
});


export { registerUser,  };
