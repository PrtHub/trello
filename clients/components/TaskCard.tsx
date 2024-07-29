import { Trash2, Edit, Grip, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDeadline } from "@/lib/format";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EditTaskForm from "@/components/EditTaskForm";
import { TaskCardProps } from "@/types";

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
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
    <div className="bg-black-3 text-white-1 px-4 py-2 rounded w-full h-fit space-y-2 relative">
      <Grip className="text-white-3 size-5 cursor-grab" />
      <h2 className="text-white-1 text-base font-medium pr-3">{task.title}</h2>
      {task.description && (
        <p className="text-gray-1 text-sm pr-3">{task.description}</p>
      )}
      {task.priority && (
        <Badge className={`${getBadgeColor(task.priority)} text-white-1`}>
          {task.priority}
        </Badge>
      )}
      {task.deadline && (
        <span className="flex items-center gap-1">
          <Clock className="text-gray-1 size-4 " />
          <p className="text-sm text-gray-1">{formatDeadline(task.deadline)}</p>
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
            onEdit={(updatedTask) => onEdit(task._id, updatedTask)}
          />
        </SheetContent>
      </Sheet>
      <Trash2
        onClick={() => onDelete(task._id, task.status)}
        className="absolute top-6 right-1 text-white-1 size-4 cursor-pointer"
      />
    </div>
  );
};

export default TaskCard;
