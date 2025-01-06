import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask, updateTask } from "~/services/taskService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import InputError from "~/components/common/input-error";
import { Plus } from "lucide-react";
import ErrorAlert from "~/components/common/error-alert";
import { TaskFormState, TaskFormSchema } from "~/validations/taskValidation";
import useNotification from "~/hooks/useNotification";

interface TaskFormDialogProps {
  fetchTasks: () => void;
  task?: TaskFormState & { id: string }; // Optional task prop for update
}

export function TaskFormDialog({ fetchTasks, task }: TaskFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TaskFormState>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task?.title || "",
      status: task?.status || "incomplete",
      category: task?.category || "General",
      priority: task?.priority || "low",
    },
  });

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("status", task.status);
      setValue("category", task.category);
      setValue("priority", task.priority);
    }
  }, [task, setValue]);

  const onSubmit = async (data: TaskFormState) => {
    setFormErrors([]);
    setLoading(true);

    try {
      if (task) {
        await updateTask(task.id, { ...data, id: task.id });
      } else {
        await createTask({ ...data, id: '' });
      }
      fetchTasks(); // Reload tasks on success
      reset(); // Reset the form on success
    
      setIsOpen(false); // Close dialog
    } catch (error) {
      if (error instanceof Error) {
        setFormErrors(error.message.split(', '));
      } else {
        setFormErrors(['An unknown error occurred']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {task ? (
          <button className="w-full cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200">
            Edit
          </button>
        ) : (
          <Button>
            <Plus /> Create
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {task ? "update" : "create"} the task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert errors={formErrors} />
          {/* Title Field */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter task title" />
            <InputError error={errors?.title?.message} />
          </div>

          {/* Category Field */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
            onValueChange={(value) => setValue("category", value as "Frontend" | "Backend" | "Documentation" | "Database" | "Testing" | "Deployment" | "General")}
            defaultValue={task?.category || "General"}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Deployment">Deployment</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <InputError error={errors?.priority?.message} />
          </div>


          {/* Status Field */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value as "incomplete" | "complete")}
              defaultValue={task?.status || "incomplete"}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
            <InputError error={errors?.status?.message} />
          </div>
          
          {/* Priority Field */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
              defaultValue={task?.priority || "low"}
            >
              <SelectTrigger id="priority" className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <InputError error={errors?.priority?.message} />
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : task ? "Update Task" : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
