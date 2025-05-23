import { Router } from "express";
import {
    addSection,
    updateSection,
    deleteSection
} from "../controllers/sectionController";

const router = Router();

router.post("/", addSection);

router.put("/:id", updateSection);

router.delete("/:id", deleteSection);

export default router;
