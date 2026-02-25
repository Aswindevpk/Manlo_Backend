import { Router } from "express";
import * as controller from "./auth.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { loginLimiter, passwordLimiter, emailLimiter, refreshLimiter } from "../../common/middleware/rate-limit.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import * as schema from "./auth.schema";

const router = Router();

router.post("/register", validate(schema.registerSchema), controller.register);
router.post("/login", loginLimiter, validate(schema.loginSchema), controller.login);

router.post("/refresh", refreshLimiter, validate(schema.refreshSchema), controller.refresh);

router.post("/logout", authenticate, validate(schema.logoutSchema), controller.logout);
router.post("/logout-all", authenticate, controller.logoutAll);

router.post("/verify-email/send", authenticate, emailLimiter, validate(schema.sendVerificationEmailSchema), controller.sendVerificationEmail);
router.post("/verify-email", validate(schema.verifyEmailSchema), controller.verifyEmail);

router.post("/forgot-password", passwordLimiter, validate(schema.forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", validate(schema.resetPasswordSchema), controller.resetPassword);

router.post("/change-password", authenticate, validate(schema.changePasswordSchema), controller.changePassword);
router.get("/me", authenticate, controller.me);

export default router;



