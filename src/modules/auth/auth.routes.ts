import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/refresh", controller.refresh);
router.get("/me", (req, res) => {
  res.json({ success: true, data: "sample" });
});

export default router;
