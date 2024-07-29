import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  adminCreateJob,
  allJobs,
  jobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/post").post(postJob);
router.route("/get").get(allJobs);
router.route("/get/:id").get(jobById);
router.route("/getadminjobs").post(adminCreateJob);

export default router;
