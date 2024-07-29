export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To-Do" | "In-Progress" | "Under-Review" | "Completed";
  priority?: "Low" | "Medium" | "Urgent";
  deadline?: Date | null;
}

export interface TaskColumnProps {
  status: "To-Do" | "In-Progress" | "Under-Review" | "Completed";
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, "_id">) => Promise<void>;
  onTaskEdit: (id: string, updatedTask: Omit<Task, "_id">) => Promise<void>;
  onTaskDelete: (id: string, status: Task["status"]) => void;
}

export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (id: string, updatedTask: Omit<Task, "_id">) => Promise<void>;
  onDelete: (id: string, status: Task["status"]) => void;
}
