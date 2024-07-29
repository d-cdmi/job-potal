import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  allApplyJob,
  applicants,
  applyJob,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/").get(allApplyJob);
router.route("/apply/:id").get(applyJob).post(applicants)
router.route("/apply/:id/status").patch(updateStatus);

export default router;
