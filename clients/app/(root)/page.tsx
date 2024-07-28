"use client";

import { useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2 } from "lucide-react";
import { formatDeadline } from "@/lib/format";
import EditTaskForm from "@/components/EditTaskForm";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To-Do" | "In-Progress" | "Under-Review" | "Completed";
  priority?: "Low" | "Medium" | "Urgent";
  deadline?: Date | null;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<{
    [key: string]: Task[];
  }>({
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
      toast.success("Task deleted successfully");
    } catch (error: any) {
      console.error("Error deleting task:", error.response.data);
      toast.error("Failed to delete task");
    }
  };

  const handleTaskEdit = async (id: string, updatedTask: Omit<Task, "_id">) => {
    try {
      const response = await axiosInstance.put(`/api/task/edit/${id}`, updatedTask);
      const editedTask = {
        ...response.data,
        deadline: response.data.deadline ? new Date(response.data.deadline) : null,
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
      toast.success("Task updated successfully");
    } catch (error: any) {
      console.error("Error editing task:", error.response.data);
      toast.error("Failed to update task");
    }
  };

  const getBadgeColor = (priority: "Low" | "Medium" | "Urgent" | undefined) => {
    switch (priority) {
      case "Low":
        return "bg-green-600";
      case "Medium":
        return "bg-yellow-600";
      case "Urgent":
        return "bg-red-600";
      default:
        return "";
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto w-full flex flex-col gap-10 items-start px-5">
      <h1 className="text-white-1 font-semibold text-3xl">Manage Your Tasks</h1>
      <section className="w-full h-full flex items-start justify-center flex-wrap gap-10">
        {["To-Do", "In-Progress", "Under-Review", "Completed"].map((status) => (
          <div
            key={status}
            className="w-[300px] flex flex-col items-start justify-start gap-5 bg-black-1 border border-black-2 p-5 rounded"
          >
            <h1 className="text-white-2 text-xl font-medium ">
              {status.replace(/-/g, " ")}
            </h1>
            <section className="flex flex-col gap-2 w-full">
              {tasks[status]?.map((task) => (
                <div
                  key={task._id}
                  className="bg-black-3 text-white-1 p-2 rounded w-full h-fit space-y-2 relative"
                >
                  <h2 className="text-white-1 text-base font-medium pr-3">
                    {task.title}
                  </h2>
                  {task.description && (
                    <p className="text-gray-1 text-sm pr-3">{task.description}</p>
                  )}
                  {task.priority && (
                    <Badge
                      className={`${getBadgeColor(task.priority)} text-white-1`}
                    >
                      {task.priority}
                    </Badge>
                  )}
                  {task.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock className="text-gray-1 size-4 " />
                      <p className="text-sm text-gray-1">
                        {formatDeadline(task.deadline)}
                      </p>
                    </span>
                  )}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Edit className="absolute -top-1 right-1 text-white-1 size-4 cursor-pointer" />
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="px-5 py-10 bg-black-1 border-none"
                    >
                      <EditTaskForm
                        taskId={task._id}
                        onEdit={(updatedTask) => handleTaskEdit(task._id, updatedTask)}
                      />
                    </SheetContent>
                  </Sheet>
                  <Trash2
                    onClick={() => handleTaskDelete(task._id, task.status)}
                    className="absolute top-6 right-1 text-white-1 size-4 cursor-pointer"
                  />
                </div>
              ))}
            </section>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full bg-orange-1 font-semibold hover:bg-orange-1/80 transition">
                  Add New+
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="px-5 py-10 bg-black-1 border-none"
              >
                <TaskForm
                  initialStatus={status as Task["status"]}
                  onSubmit={handleTaskCreate}
                />
              </SheetContent>
            </Sheet>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
