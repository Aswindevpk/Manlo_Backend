import { Request, Response } from "express";
import * as service from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;

    const result = await service.login({ email, password, userAgent, ipAddress });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("Refresh token required");

    await service.logout(refreshToken);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("Refresh token required");

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;

    const result = await service.refresh(refreshToken, userAgent, ipAddress);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};
