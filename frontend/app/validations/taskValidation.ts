import { z } from 'zod';

export const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["incomplete", "complete"]).refine((val) => val !== undefined, {
    message: "Status is required",
  }),
  category: z.enum(["Frontend", "Backend", "Documentation", "Database", "Testing", "Deployment", "General"]).refine((val) => val !== undefined, {
    message: "Category is required",
  }),
  priority: z.enum(["low", "medium", "high"]).refine((val) => val !== undefined, {
    message: "Priority is required",
  }),
});

// Types for the form states based on the schemas
export type TaskFormState = z.infer<typeof TaskFormSchema>;
