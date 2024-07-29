import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TaskForm from "@/components/TaskForm";
import TaskCard from "./TaskCard";
import { Task, TaskColumnProps } from "@/types";
import { Droppable } from "@hello-pangea/dnd";

const TaskColumn = ({
  status,
  tasks,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete,
}: TaskColumnProps) => {
  return (
    <Droppable droppableId={status} type="TASK">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-[300px] flex flex-col items-start justify-start gap-5 bg-black-1 border border-black-2 px-4 py-4 rounded"
        >
          <h1 className="text-white-2 text-xl font-medium">
            {status.replace(/-/g, " ")}
          </h1>
          <section className="flex flex-col gap-2 w-full">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                index={index}
              />
            ))}
            {provided.placeholder}
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
              <TaskForm initialStatus={status} onSubmit={onTaskCreate} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
