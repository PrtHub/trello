"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["To-Do", "In-Progress", "Under-Review", "Completed"]),
  priority: z.enum(["Low", "Medium", "Urgent"]).optional(),
  deadline: z.date().nullable().optional(),
});

type TaskSchema = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (task: Omit<TaskSchema, "_id">) => Promise<void>;
  initialStatus?: "To-Do" | "In-Progress" | "Under-Review" | "Completed";
  initialData?: Partial<TaskSchema>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialStatus,
  initialData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      status: initialStatus || initialData.status || "To-Do",
      priority: initialData.priority || "Low",
      deadline: initialData.deadline || null,
    },
  });

  const handleFormSubmit: SubmitHandler<TaskSchema> = async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      toast.success("Task created!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white-2">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="bg-black-3 text-gray-1 placeholder:text-gray-1 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white-2">Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="bg-black-3 text-gray-1 placeholder:text-gray-1 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white-2">Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-black-3 text-white-2">
                    <SelectValue
                      className="text-white-2 placeholder:text-white-2"
                      placeholder="Select one Status"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-white-2 bg-black-3">
                    <SelectGroup>
                      <SelectItem value="To-Do">To-Do</SelectItem>
                      <SelectItem value="In-Progress">In-Progress</SelectItem>
                      <SelectItem value="Under-Review">Under-Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white-2">Priority</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-black-3 text-white-2">
                    <SelectValue
                      className="text-white-2 placeholder:text-white-2"
                      placeholder="Select Your Priority"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-white-2 bg-black-3">
                    <SelectGroup>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white-2">Deadline</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholderText="Pick a date"
                  className="w-full bg-black-3 text-white-2 px-2 py-3 border-none outline-none rounded-md text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-orange-1 w-full hover:bg-orange-1/80 transition"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
