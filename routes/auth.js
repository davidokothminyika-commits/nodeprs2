import express from 'express';
import * as forgotPasswordController from "../controllers/forgotPasswordController.js";
import * as loginController from "../controllers/login.js";
import * as registerController from "../controllers/register.js";


const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.post("/forgotpassword", forgotPasswordController.forgotPassword);
router.post("/resetpassword", forgotPasswordController.resetPassword);

// router.get("/logout", logout);

export default router;