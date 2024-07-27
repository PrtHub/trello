import { NextFunction, Request, Response } from "express";
import Task from "../models/task.model";
import { errorHandler } from "../utils/errorHandler";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, status, priority, deadline } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Unauthorized!"));
  }

  try {
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
      userId,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const editTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, description, status, priority, deadline } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          status,
          priority,
          deadline: deadline ? new Date(deadline) : undefined,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return next(errorHandler(404, "Task not found"));
    }

    if (updatedTask.userId.toString() !== userId.toString()) {
      return next(
        errorHandler(403, "You do not have permission to update this task")
      );
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    if (task.userId.toString() !== userId.toString()) {
      return next(
        errorHandler(403, "You do not have permission to delete this task")
      );
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTasksByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }

  if (!["To-Do", "In-Progress", "Under-Review", "Completed"].includes(status)) {
    return next(errorHandler(400, "Invalid status"));
  }

  try {
    const tasks = await Task.find({ status, userId });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
