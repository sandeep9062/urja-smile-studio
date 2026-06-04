/**
 * Zod validation schemas — single source of truth for input validation.
 *
 * These schemas are used:
 *   • On the server (Next.js Route Handlers) for end-to-end input validation.
 *   • On the client (forms) to provide instant feedback via the same rules.
 *
 * If you change a schema, both the API route and any form using it stay in sync.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const cuidSchema = z.string().min(1, "Id is required").max(64);

/** E.164-ish phone: 7–15 digits, optional +, spaces, dashes, parens. */
export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Phone number is too short")
  .max(20, "Phone number is too long")
  .regex(/^[+]?[0-9\s()-]{7,20}$/, "Invalid phone number");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(254, "Email is too long");

export const urlSchema = z
  .string()
  .trim()
  .url("Invalid URL")
  .max(2048, "URL is too long")
  .or(z.literal(""))
  .optional();

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens");

export const shortTextSchema = (max = 150) =>
  z.string().trim().min(1, "Required").max(max, `Must be at most ${max} characters`);

export const longTextSchema = (max = 5000) =>
  z.string().trim().min(1, "Required").max(max, `Must be at most ${max} characters`);

export const optionalLongTextSchema = (max = 5000) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters`)
    .optional()
    .or(z.literal(""));

export const dateStringSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const isoDateStringSchema = z
  .string()
  .trim()
  .min(1)
  .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid ISO date string");

export const timeStringSchema = z
  .string()
  .trim()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d(?:\s?(?:AM|PM|am|pm))?$/,
    "Time must be HH:MM (24h) or HH:MM AM/PM",
  );

export const positiveIntSchema = z
  .number()
  .int("Must be a whole number")
  .positive("Must be positive")
  .finite();

export const nonNegativeIntSchema = z
  .number()
  .int("Must be a whole number")
  .nonnegative("Must be zero or positive")
  .finite();

/** Coerce a value that may arrive as a string (query param / FormData) into a number. */
export const intFromStringSchema = z
  .union([z.number(), z.string()])
  .transform((v, ctx) => {
    const n = typeof v === "number" ? v : parseInt(v, 10);
    if (!Number.isFinite(n) || Number.isNaN(n)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be a number" });
      return z.NEVER;
    }
    return n;
  });

/** Pagination query — accepts string or number, clamps to safe bounds. */
export const paginationQuerySchema = z.object({
  page: intFromStringSchema
    .optional()
    .default("1")
    .transform((n) => Math.max(1, n)),
  limit: intFromStringSchema
    .optional()
    .default("10")
    .transform((n) => Math.min(100, Math.max(1, n))),
  search: z.string().trim().max(200).optional().default(""),
  status: z.string().trim().max(50).optional().default(""),
  category: z.string().trim().max(50).optional().default(""),
  sort: z.string().trim().max(50).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(200, "Password is too long"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Public contact form
// ---------------------------------------------------------------------------

export const contactSubmissionSchema = z.object({
  name: shortTextSchema(100),
  phone: phoneSchema,
  email: emailSchema,
  subject: z.string().trim().max(150, "Subject is too long").optional().or(z.literal("")),
  message: z.string().trim().min(5, "Please enter your message").max(2000, "Message is too long"),
  // Honeypot — must be empty for legitimate clients.
  website: z.string().max(0, "Spam detected").optional().default(""),
});
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// ---------------------------------------------------------------------------
// Public appointment booking
// ---------------------------------------------------------------------------

export const consultationTypeEnum = z.enum(["VIDEO", "PHYSICAL"]);

export const appointmentBookingSchema = z.object({
  service: shortTextSchema(150),
  doctor: shortTextSchema(150),
  consultationType: consultationTypeEnum.default("PHYSICAL"),
  date: dateStringSchema,
  time: timeStringSchema,
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(254, "Email is too long")
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  complaint: z.string().trim().max(1000, "Complaint is too long").optional().or(z.literal("")),
  website: z.string().max(0, "Spam detected").optional().default(""), // honeypot
});
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;

// ---------------------------------------------------------------------------
// Appointments (admin)
// ---------------------------------------------------------------------------

export const appointmentStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "rescheduled",
]);

export const createAppointmentSchema = z.object({
  patientName: shortTextSchema(100),
  patientPhone: phoneSchema,
  patientEmail: emailSchema,
  patientId: cuidSchema.optional().or(z.literal("")),
  serviceId: cuidSchema.optional().or(z.literal("")),
  doctorId: cuidSchema.optional().or(z.literal("")),
  date: dateStringSchema,
  time: timeStringSchema,
  status: appointmentStatusSchema.optional().default("pending"),
  notes: optionalLongTextSchema(2000),
});
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = createAppointmentSchema.partial();
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

export const genderSchema = z.enum(["male", "female", "other"]);

export const createPatientSchema = z.object({
  name: shortTextSchema(100),
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: dateStringSchema.optional().or(z.literal("")),
  gender: genderSchema.optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  medicalHistory: z.string().trim().max(5000).optional().or(z.literal("")),
  allergies: z.string().trim().max(2000).optional().or(z.literal("")),
  photo: urlSchema,
});
export type CreatePatientInput = z.infer<typeof createPatientSchema>;

export const updatePatientSchema = createPatientSchema.partial();
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

export const createDoctorSchema = z.object({
  name: shortTextSchema(100),
  slug: slugSchema,
  photo: urlSchema,
  qualification: shortTextSchema(200),
  experience: positiveIntSchema.max(80, "Experience must be realistic"),
  specializations: z
    .array(z.string().trim().min(1).max(100))
    .min(1, "At least one specialization is required")
    .max(20),
  bio: z.string().trim().min(1, "Bio is required").max(5000),
  consultationFees: z.union([
    z
      .number()
      .nonnegative("Fees must be zero or positive")
      .max(1_000_000, "Fees look too high"),
    z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Fees must be a number with up to 2 decimals")
      .transform((v) => parseFloat(v)),
  ]),
  isActive: z.boolean().optional().default(true),
  order: nonNegativeIntSchema.optional().default(0),
});
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

export const updateDoctorSchema = createDoctorSchema.partial();
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const createServiceSchema = z.object({
  name: shortTextSchema(150),
  slug: slugSchema,
  icon: z.string().trim().max(100).optional().or(z.literal("")),
  banner: urlSchema,
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(10_000),
  benefits: z.array(z.string().trim().min(1).max(500)).max(50).optional().default([]),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  order: nonNegativeIntSchema.optional().default(0),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(500).optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1).max(80)).max(50).optional().default([]),
  ogImage: urlSchema,
  canonicalUrl: urlSchema,
});
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export const blogStatusSchema = z.enum(["draft", "published", "scheduled"]);

export const seoSchema = z
  .object({
    metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
    metaDescription: z.string().trim().max(500).optional().or(z.literal("")),
    keywords: z.array(z.string().trim().min(1).max(80)).max(50).optional().default([]),
    ogImage: urlSchema,
    canonicalUrl: urlSchema,
  })
  .optional()
  .default({});

export const createBlogSchema = z.object({
  title: shortTextSchema(250),
  slug: slugSchema,
  content: z.string().min(1, "Content is required").max(500_000),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(1000),
  featuredImage: urlSchema,
  category: shortTextSchema(80),
  tags: z.array(z.string().trim().min(1).max(50)).max(50).optional().default([]),
  status: blogStatusSchema.optional().default("draft"),
  publishDate: isoDateStringSchema.optional().or(z.literal("")),
  seo: seoSchema,
});
export type CreateBlogInput = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = createBlogSchema.partial();
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export const createGallerySchema = z.object({
  url: z.string().trim().url("Invalid image URL").max(2048),
  thumbnail: z.string().trim().url("Invalid thumbnail URL").max(2048),
  title: shortTextSchema(150),
  caption: z.string().trim().max(500).optional().or(z.literal("")),
  category: shortTextSchema(80),
  treatmentTags: z.array(z.string().trim().min(1).max(80)).max(50).optional().default([]),
  order: nonNegativeIntSchema.optional().default(0),
});
export type CreateGalleryInput = z.infer<typeof createGallerySchema>;

export const updateGallerySchema = createGallerySchema.partial();
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const testimonialStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const createTestimonialSchema = z.object({
  patientName: shortTextSchema(100),
  patientPhoto: urlSchema,
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  testimonial: z.string().trim().min(10, "Testimonial is too short").max(2000),
  treatment: z.string().trim().max(150).optional().or(z.literal("")),
  status: testimonialStatusSchema.optional().default("pending"),
  isFeatured: z.boolean().optional().default(false),
});
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;

export const updateTestimonialSchema = createTestimonialSchema.partial();
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

// ---------------------------------------------------------------------------
// Enquiries (admin create / update)
// ---------------------------------------------------------------------------

export const enquiryStatusSchema = z.enum(["new", "in_progress", "closed"]);

export const createEnquirySchema = contactSubmissionSchema.extend({
  status: enquiryStatusSchema.optional().default("new"),
  assignedToId: cuidSchema.optional().or(z.literal("")),
});
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const updateEnquirySchema = z.object({
  name: shortTextSchema(100).optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  subject: shortTextSchema(200).optional(),
  message: z.string().trim().min(5).max(5000).optional(),
  status: enquiryStatusSchema.optional(),
  assignedToId: cuidSchema.optional().or(z.literal("")),
});
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const userRoleSchema = z.enum(["owner", "doctor", "front_desk", "editor"]);

export const createUserSchema = z.object({
  name: shortTextSchema(100),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password is too long"),
  role: userRoleSchema.optional().default("front_desk"),
  avatar: urlSchema,
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: shortTextSchema(100).optional(),
    email: emailSchema.optional(),
    role: userRoleSchema.optional(),
    avatar: urlSchema,
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    isActive: z.boolean().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200, "Password is too long")
      .optional(),
  })
  .strict();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ---------------------------------------------------------------------------
// Clinic settings
// ---------------------------------------------------------------------------

const footerLinkSchema = z.object({
  label: shortTextSchema(80),
  url: z.string().trim().min(1).max(2048),
  order: nonNegativeIntSchema.optional().default(0),
});

const clinicTimingSchema = z.object({
  day: shortTextSchema(20),
  openTime: timeStringSchema,
  closeTime: timeStringSchema,
  isClosed: z.boolean().optional().default(false),
});

export const updateSettingsSchema = z
  .object({
    clinicName: shortTextSchema(150),
    phoneNumbers: z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]),
    emails: z.array(emailSchema).max(20).optional().default([]),
    address: z.string().trim().min(1).max(500),
    googleMapLink: urlSchema,
    socialMedia: z.record(z.string(), z.string().max(2048)).optional().default({}),
    footerLinks: z.array(footerLinkSchema).max(100).optional().default([]),
    timings: z.array(clinicTimingSchema).max(14).optional().default([]),
  })
  .strict();
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

// ---------------------------------------------------------------------------
// Redirects
// ---------------------------------------------------------------------------

export const redirectTypeSchema = z.enum(["PERMANENT", "TEMPORARY"]);

export const createRedirectSchema = z.object({
  oldUrl: z.string().trim().min(1).max(2048),
  newUrl: z.string().trim().min(1).max(2048),
  type: redirectTypeSchema.optional().default("PERMANENT"),
  isActive: z.boolean().optional().default(true),
});
export type CreateRedirectInput = z.infer<typeof createRedirectSchema>;

export const updateRedirectSchema = createRedirectSchema.partial();
export type UpdateRedirectInput = z.infer<typeof updateRedirectSchema>;

// ---------------------------------------------------------------------------
// Cloudinary
// ---------------------------------------------------------------------------

export const cloudinarySignSchema = z.object({
  folder: z.string().trim().min(1).max(200).optional().default("urja-dental"),
  publicId: z.string().trim().max(200).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(80)).max(50).optional(),
  eager: z.string().trim().max(500).optional().or(z.literal("")),
});
export type CloudinarySignInput = z.infer<typeof cloudinarySignSchema>;

export const cloudinaryDeleteSchema = z.object({
  publicId: z.string().trim().min(1, "publicId is required").max(300),
  resourceType: z.enum(["image", "video", "raw"]).optional().default("image"),
});
export type CloudinaryDeleteInput = z.infer<typeof cloudinaryDeleteSchema>;

// ---------------------------------------------------------------------------
// Helpers — flatten Zod errors into a field-keyed object for easy UX rendering
// ---------------------------------------------------------------------------

export type FieldErrors<T = Record<string, unknown>> = Partial<Record<keyof T | string, string>>;

export function formatZodErrors(error: z.ZodError): {
  message: string;
  fieldErrors: FieldErrors;
} {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  const message = error.issues[0]?.message ?? "Invalid input";
  return { message, fieldErrors };
}
