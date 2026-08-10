import { Router, type Request, type Response, type NextFunction } from "express";
import {
  completeOnboarding,
  findUserByToken,
  login,
  logout,
  publicUser,
  signup,
  updateRoles,
  type RoleChoice,
} from "./store.js";

export type AuthedRequest = Request & { userId?: string; token?: string };

function getToken(req: Request) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const bodyToken = typeof req.body?.token === "string" ? req.body.token : null;
  return bodyToken;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Sign in required" });
    return;
  }
  const user = await findUserByToken(token);
  if (!user) {
    res.status(401).json({ error: "Session expired. Please sign in again." });
    return;
  }
  (req as AuthedRequest).userId = user.id;
  (req as AuthedRequest).token = token;
  next();
}

function isRoleChoice(value: unknown): value is RoleChoice {
  return value === "learner" || value === "educator" || value === "both";
}

export function createAuthRouter() {
  const router = Router();

  router.post("/auth/signup", async (req, res) => {
    try {
      const { name, email, password, roleChoice } = req.body ?? {};
      if (!isRoleChoice(roleChoice)) {
        res.status(400).json({ error: "Choose learner, educator, or both" });
        return;
      }
      const result = await signup({
        name: String(name ?? ""),
        email: String(email ?? ""),
        password: String(password ?? ""),
        roleChoice,
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Signup failed",
      });
    }
  });

  router.post("/auth/login", async (req, res) => {
    try {
      const result = await login({
        email: String(req.body?.email ?? ""),
        password: String(req.body?.password ?? ""),
      });
      res.json(result);
    } catch (err) {
      res.status(401).json({
        error: err instanceof Error ? err.message : "Login failed",
      });
    }
  });

  router.post("/auth/logout", requireAuth, (req, res) => {
    const token = (req as AuthedRequest).token;
    if (token) logout(token);
    res.json({ ok: true });
  });

  router.get("/auth/me", requireAuth, async (req, res) => {
    const token = getToken(req);
    const user = token ? await findUserByToken(token) : null;
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({ user: publicUser(user) });
  });

  router.post("/auth/onboarding", requireAuth, async (req, res) => {
    try {
      const userId = (req as AuthedRequest).userId!;
      const user = await completeOnboarding(userId, {
        bio: req.body?.bio,
        educator: req.body?.educator,
        learner: req.body?.learner,
      });
      res.json({ user });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Onboarding failed",
      });
    }
  });

  router.post("/auth/roles", requireAuth, async (req, res) => {
    try {
      const userId = (req as AuthedRequest).userId!;
      if (!isRoleChoice(req.body?.roleChoice)) {
        res.status(400).json({ error: "Choose learner, educator, or both" });
        return;
      }
      const user = await updateRoles(userId, req.body.roleChoice);
      res.json({ user });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Could not update roles",
      });
    }
  });

  return router;
}
