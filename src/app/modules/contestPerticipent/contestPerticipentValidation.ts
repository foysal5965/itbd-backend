import { z } from "zod";

// Enums for specific fields
const IsStudent = z.enum(["YES", "NO"]);
const JobExperience = z.enum(["NONE", "LESS_THAN_6_MONTHS", "SIX_TO_TWELVE_MONTHS", "MORE_THAN_TWELVE_MONTHS"]);
const TShirtSize = z.enum(["S", "M", "L", "XL", "XXL"]);

// Zod schema for ContestPerticipent
export const ContestPerticipentSchema = z.object({
  id: z.string().uuid().optional(), // Auto-generated UUID
  name: z.string().min(1, { message: "Name is required" }), // Non-empty string
  email: z
    .string()
    .email({ message: "Invalid email address" }), // Must be a valid email
  tShirtSize: TShirtSize.default("L"), // Enum with default
  image: z.string().url().optional(), // Optional URL
  contestId:z.string(),
  instituteName:z.string(),
  permissionLetter: z.string().url().optional(), // Optional URL
});