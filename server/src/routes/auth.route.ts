import express from "express";
import { getUser, google, signin, signout, signup } from "../controller/auth.controller";
import { verifyToken } from "../utils/verifyUser";

const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)
router.post("/signout", signout)
router.get("/get-user", verifyToken, getUser)

export default router