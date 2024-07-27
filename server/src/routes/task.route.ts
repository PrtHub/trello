import express from "express";
import { verifyToken } from "../utils/verifyUser";
import { createTask, deleteTask, editTask, getAllTask, getTasksByStatus } from "../controller/task.controller";

const router = express.Router();

router.post("/create", verifyToken, createTask)
router.put("/edit/:id", verifyToken,  editTask)
router.delete("/delete/:id", verifyToken,  deleteTask)
router.get("/all", verifyToken, getAllTask)
router.get('/status/:status', verifyToken, getTasksByStatus);


export default router