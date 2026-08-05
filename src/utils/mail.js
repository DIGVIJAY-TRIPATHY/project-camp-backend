import Mailgen from "mailgen";

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Project Camp! We're very excited to have you on board.",
            action: {
                instructions:
                    "To verify your email address, please click the button below:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify Email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "You have requested to reset your password for Project Camp.",
            action: {
                instructions:
                    "To reset your password, please click the button below:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset Password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};


export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
}