import { Router } from "express";
import {
  getResearchesByIssue,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
  search,
  reorderResearch,
} from "../controllers/researchController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/issue/:issue", getResearchesByIssue);
router.get("/search/", search);

router.get("/:id", getResearchById);

router.post("/", authMiddleware, createResearch);

router.put("/:id/reorder/", authMiddleware, reorderResearch)
router.put("/:id", authMiddleware, updateResearch);


router.delete("/:id", authMiddleware, deleteResearch);


export default router;
