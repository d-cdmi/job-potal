import express from "express";
import {
  getComapnyById,
  getCompany,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/register").post(registerCompany);
router.route("/get").post(getCompany);
router.route("/get/:id").get(getComapnyById);
router.route("/update/:id").patch(updateCompany);

export default router;
