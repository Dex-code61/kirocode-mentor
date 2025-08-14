import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [twoFactorClient()],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
    updateUser,
    changePassword,
    forgetPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    twoFactor,
} = authClient;

