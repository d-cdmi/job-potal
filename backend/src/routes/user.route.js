import express from "express";
import {
  login,
  logout,
  register,
  updateUserProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.use(isAuthenticated);

router.route("/logout").post(logout);
router.route("/profile").patch(updateUserProfile);

export default router;
