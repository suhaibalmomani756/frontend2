import { Router } from "express";
import { rateCourse, getMyRatings } from "../controllers/ratingController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/rate/:courseId", requireAuth, rateCourse);
router.get("/my", requireAuth, getMyRatings);

export default router;
