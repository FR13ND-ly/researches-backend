import { Router } from "express";
import {
  createIssue,
  getIssuesByCategory,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "../controllers/issueController";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

router.get("/categories/:category", getIssuesByCategory);

router.get("/:id", getIssueById);

router.post("/", createIssue);

router.put("/:id", updateIssue);

router.delete("/:id", deleteIssue);

export default router;
