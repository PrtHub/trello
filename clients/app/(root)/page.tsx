"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import TaskColumn from "@/components/TaskColumn";
import { Task } from "@/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const Dashboard = () => {
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    "To-Do": [],
    "In-Progress": [],
    "Under-Review": [],
    Completed: [],
  });

  const fetchTasksByStatus = async (status: string) => {
    try {
      const response = await axiosInstance.get(`/api/task/status/${status}`);
      const fetchedTasks = response.data.map((task: any) => ({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : null,
      }));
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: fetchedTasks,
      }));
    } catch (error: any) {
      console.error(
        `Error fetching tasks for status ${status}:`,
        error.response.data
      );
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    ["To-Do", "In-Progress", "Under-Review", "Completed"].forEach((status) => {
      fetchTasksByStatus(status);
    });
  }, []);

  const handleTaskCreate = async (task: Omit<Task, "_id">) => {
    try {
      const response = await axiosInstance.post("/api/task/create", task);
      const newTask = {
        ...response.data,
        deadline: response.data.deadline
          ? new Date(response.data.deadline)
          : null,
      };
      setTasks((prevTasks) => ({
        ...prevTasks,
        [task.status]: [...prevTasks[task.status], newTask],
      }));
    } catch (error: any) {
      console.error("Error creating task:", error.response.data);
      toast.error("Failed to create task");
    }
  };

  const handleTaskDelete = async (id: string, status: Task["status"]) => {
    try {
      await axiosInstance.delete(`/api/task/delete/${id}`);
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks[status].filter(
          (task) => task._id !== id
        );
        return { ...prevTasks, [status]: updatedTasks };
      });
      toast.success("Task deleted!");
    } catch (error: any) {
      console.error("Error deleting task:", error.response.data);
      toast.error("Failed to delete task");
    }
  };

  const handleTaskEdit = async (id: string, updatedTask: Omit<Task, "_id">) => {
    try {
      const response = await axiosInstance.put(
        `/api/task/edit/${id}`,
        updatedTask
      );
      const editedTask = {
        ...response.data,
        deadline: response.data.deadline
          ? new Date(response.data.deadline)
          : null,
      };
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks[editedTask.status].map((task) =>
          task._id === id ? editedTask : task
        );
        if (editedTask.status !== updatedTask.status) {
          return {
            ...prevTasks,
            [updatedTask.status]: prevTasks[updatedTask.status].filter(
              (task) => task._id !== id
            ),
            [editedTask.status]: updatedTasks,
          };
        }
        return { ...prevTasks, [editedTask.status]: updatedTasks };
      });
      toast.success("Task updated!");
    } catch (error: any) {
      console.error("Error editing task:", error.response.data);
      toast.error("Failed to update task");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks[source.droppableId].find(
      (task) => task._id === draggableId
    );

    if (!movedTask) return;

    const updatedStatus = destination.droppableId as Task["status"];

    try {
      await axiosInstance.put(`/api/task/edit/${draggableId}`, {
        ...movedTask,
        status: updatedStatus,
      });

      const updatedTasks = {
        ...tasks,
        [source.droppableId]: tasks[source.droppableId].filter(
          (task) => task._id !== draggableId
        ),
        [updatedStatus]: [
          ...tasks[updatedStatus],
          { ...movedTask, status: updatedStatus },
        ],
      };

      setTasks(updatedTasks);
      toast.success("Task position updated!");
    } catch (error: any) {
      console.error("Error updating task status:", error.response.data);
      toast.error("Failed to update task status");
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto w-full flex flex-col gap-10 items-start px-5 py-5">
      <h1 className="text-white-1 font-semibold text-3xl">Manage Your Tasks</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="droppable-columns"
          direction="horizontal"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-full h-full flex items-start justify-center flex-wrap gap-10"
            >
              {["To-Do", "In-Progress", "Under-Review", "Completed"].map((status, index) => (
                <Draggable
                  key={status}
                  draggableId={status}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskColumn
                        status={status as Task["status"]}
                        tasks={tasks[status]}
                        onTaskCreate={handleTaskCreate}
                        onTaskEdit={handleTaskEdit}
                        onTaskDelete={handleTaskDelete}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
};

export default Dashboard;
