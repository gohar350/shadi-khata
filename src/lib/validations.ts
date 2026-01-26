import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export const familySchema = z.object({
  name: z.string().min(1, "Family name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
});

export const invitationSchema = z.object({
  eventId: z.string().min(1, "Please select an event"),
  familyId: z.string().min(1, "Please select a family"),
  persons: z.number().min(1, "At least 1 person is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type FamilyInput = z.infer<typeof familySchema>;
export type InvitationInput = z.infer<typeof invitationSchema>;
