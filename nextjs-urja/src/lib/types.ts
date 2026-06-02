// ============================================================
// Urja Dental Clinic - Admin Dashboard Types
// ============================================================

// --- User & Auth Types ---
export type UserRole = "owner" | "doctor" | "front_desk" | "editor";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// --- Permission Types ---
export interface Permission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    { module: "dashboard", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "appointments", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "patients", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "doctors", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "services", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "gallery", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "blogs", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "testimonials", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "reviews", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "homepage", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "enquiries", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "seo", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "users", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "redirects", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "settings", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "logs", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: "backups", canView: true, canCreate: true, canEdit: false, canDelete: true },
  ],
  doctor: [
    { module: "dashboard", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: "appointments", canView: true, canCreate: false, canEdit: true, canDelete: false },
    { module: "patients", canView: true, canCreate: false, canEdit: true, canDelete: false },
    { module: "doctors", canView: true, canCreate: false, canEdit: false, canDelete: false },
  ],
  front_desk: [
    { module: "dashboard", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: "appointments", canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: "patients", canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: "enquiries", canView: true, canCreate: true, canEdit: true, canDelete: false },
  ],
  editor: [
    { module: "dashboard", canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: "blogs", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "gallery", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "testimonials", canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: "homepage", canView: true, canCreate: false, canEdit: true, canDelete: false },
    { module: "services", canView: true, canCreate: false, canEdit: true, canDelete: false },
  ],
};

// --- Appointment Types ---
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";

export interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  service: string;
  serviceId?: string;
  doctor: string;
  doctorId?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Patient Types ---
export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  photo?: string;
  appointments?: Appointment[];
  notes?: PatientNote[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientNote {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

// --- Doctor Types ---
export interface Doctor {
  _id: string;
  name: string;
  slug: string;
  photo?: string;
  qualification: string;
  experience: number;
  specializations: string[];
  bio: string;
  schedule: DoctorSchedule[];
  consultationFees: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// --- Service Types ---
export interface Service {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  banner?: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  faqs: FAQ[];
  beforeAfterPhotos: BeforeAfterPhoto[];
  category?: string;
  seo: SEOFields;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BeforeAfterPhoto {
  before: string;
  after: string;
  caption?: string;
}

// --- SEO Types ---
export interface SEOFields {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface SEOScore {
  page: string;
  score: number;
  checks: SEOCheck[];
}

export interface SEOCheck {
  type: "success" | "warning" | "error";
  message: string;
  details?: string;
}

// --- Blog Types ---
export type BlogStatus = "draft" | "published" | "scheduled";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  authorId?: string;
  status: BlogStatus;
  publishDate?: string;
  seo: SEOFields;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// --- Gallery Types ---
export interface GalleryImage {
  _id: string;
  url: string;
  thumbnail: string;
  title: string;
  caption?: string;
  category: string;
  treatmentTags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

// --- Testimonial Types ---
export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  _id: string;
  patientName: string;
  patientPhoto?: string;
  rating: number;
  testimonial: string;
  treatment?: string;
  status: TestimonialStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Review Types ---
export interface GoogleReview {
  _id: string;
  embedUrl: string;
  isEnabled: boolean;
  showOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Enquiry Types ---
export type EnquiryStatus = "new" | "in_progress" | "closed";

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  assignedTo?: string;
  internalNotes: EnquiryNote[];
  conversationHistory: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface ConversationMessage {
  _id: string;
  type: "email" | "sms" | "internal";
  content: string;
  sentBy: string;
  sentAt: string;
}

// --- Homepage Manager Types ---
export interface HeroSection {
  heading: string;
  subheading: string;
  ctaButtons: { label: string; link: string }[];
  backgroundImage?: string;
}

export interface USPItem {
  _id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface PromotionalOffer {
  _id: string;
  bannerImage?: string;
  offerText: string;
  expiryDate: string;
  isActive: boolean;
}

export interface HomepagePopup {
  _id: string;
  image?: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

// --- Redirect Types ---
export interface Redirect {
  _id: string;
  oldUrl: string;
  newUrl: string;
  type: 301 | 302;
  isActive: boolean;
  hits: number;
  createdAt: string;
  updatedAt: string;
}

// --- Activity Log Types ---
export interface ActivityLog {
  _id: string;
  user: string;
  userId: string;
  action: string;
  module: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

// --- Backup Types ---
export interface Backup {
  _id: string;
  type: "automatic" | "manual";
  status: "completed" | "failed" | "in_progress";
  databaseSize: string;
  mediaSize: string;
  createdAt: string;
  completedAt?: string;
}

// --- Settings Types ---
export interface ClinicSettings {
  _id: string;
  clinicName: string;
  phoneNumbers: string[];
  emails: string[];
  address: string;
  googleMapLink?: string;
  timings: ClinicTiming[];
  socialMedia: SocialMediaLinks;
  footerLinks: FooterLink[];
}

export interface ClinicTiming {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface FooterLink {
  label: string;
  url: string;
  order: number;
}

// --- API Response Types ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Dashboard Stats Types ---
export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  activePatients: number;
  blogPosts: number;
  enquiries: number;
  websiteVisitors: number;
}

// --- Page Manager Types ---
export interface PageContent {
  _id: string;
  slug: string;
  title: string;
  content: string;
  seo: SEOFields;
  status: "draft" | "published";
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
}
