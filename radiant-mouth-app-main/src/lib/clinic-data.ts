import {
  Sparkles, Stethoscope, Smile, Baby, Scissors, Heart, Activity, Wrench,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  duration: string;
  priceFrom: string;
};

export const services: Service[] = [
  {
    slug: "dental-implants",
    title: "Dental Implants",
    short: "Permanent, natural-looking tooth replacement.",
    description:
      "Premium titanium implants restore your bite and smile with lifetime-grade results. Our digitally-guided implant placement ensures precision, faster healing and natural aesthetics.",
    icon: Wrench,
    highlights: ["3D guided placement", "Premium Swiss/Korean implants", "Same-day teeth options", "Lifetime warranty support"],
    duration: "60–90 min per visit",
    priceFrom: "₹24,999",
  },
  {
    slug: "root-canal",
    title: "Root Canal",
    short: "Painless, single-sitting RCT.",
    description:
      "Save your natural tooth with our advanced rotary endodontics. We use micro-vision, painless anesthesia and biocompatible materials for long-lasting comfort.",
    icon: Activity,
    highlights: ["Single-sitting RCT", "Painless protocol", "Rotary endodontics", "Crown protection"],
    duration: "45–75 min",
    priceFrom: "₹3,499",
  },
  {
    slug: "braces-aligners",
    title: "Braces & Aligners",
    short: "Metal, ceramic & invisible aligners.",
    description:
      "From classic braces to clear aligners, we craft personalized orthodontic plans for kids, teens and adults — straightening smiles with discreet, comfortable technology.",
    icon: Smile,
    highlights: ["Invisible aligners", "Self-ligating braces", "Digital smile planning", "EMI options"],
    duration: "Plans from 6–24 months",
    priceFrom: "₹29,999",
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    short: "Brighter smile in a single visit.",
    description:
      "Professional in-office whitening lifts stains and brightens shades up to 6–8 levels in one session, safely and without sensitivity using enamel-friendly gels.",
    icon: Sparkles,
    highlights: ["Zoom & laser systems", "Enamel safe", "Visible same-day results", "Take-home kits"],
    duration: "60 min",
    priceFrom: "₹6,999",
  },
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    short: "Veneers, smile makeovers, bonding.",
    description:
      "Designer smiles, crafted around your face. We use digital smile design and premium porcelain veneers to deliver Instagram-ready, natural results.",
    icon: Heart,
    highlights: ["Digital smile design", "Porcelain veneers", "Composite bonding", "Gum contouring"],
    duration: "Multiple visits",
    priceFrom: "₹12,999",
  },
  {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    short: "Gentle care for little smiles.",
    description:
      "Anxiety-free dental visits for children with playful environments, behavior-shaping techniques, fluoride therapy, sealants and early orthodontic guidance.",
    icon: Baby,
    highlights: ["Kid-friendly chairs", "Sedation options", "Sealants & fluoride", "Habit counseling"],
    duration: "30–45 min",
    priceFrom: "₹999",
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    short: "Wisdom teeth & complex extractions.",
    description:
      "Safe, sterile and minimally invasive surgical care including wisdom tooth removal, impactions, bone grafting and pre-implant procedures.",
    icon: Scissors,
    highlights: ["Minimally invasive", "Conscious sedation", "Bone grafting", "Same-day discharge"],
    duration: "45–90 min",
    priceFrom: "₹4,999",
  },
  {
    slug: "gum-treatment",
    title: "Gum Treatment",
    short: "Healthy gums for a lasting smile.",
    description:
      "Comprehensive periodontal therapy — from deep cleaning to laser gum reshaping — to treat bleeding, recession and bad breath, gently and effectively.",
    icon: Stethoscope,
    highlights: ["Laser gum therapy", "Scaling & root planing", "Gum grafting", "Maintenance care"],
    duration: "45–60 min",
    priceFrom: "₹2,499",
  },
];

export type Doctor = {
  id: string;
  name: string;
  qualifications: string;
  specialization: string;
  experience: number;
  bio: string;
};

export const doctors: Doctor[] = [
  {
    id: "dr-aanya-mehta",
    name: "Dr. Aanya Mehta",
    qualifications: "BDS, MDS — Prosthodontics",
    specialization: "Smile Design & Implants",
    experience: 14,
    bio: "Pioneer of digital smile design in the region, with 1,000+ implant cases.",
  },
  {
    id: "dr-rohan-kapoor",
    name: "Dr. Rohan Kapoor",
    qualifications: "BDS, MDS — Orthodontics",
    specialization: "Braces & Clear Aligners",
    experience: 11,
    bio: "Certified Invisalign provider known for gentle, on-time orthodontic care.",
  },
  {
    id: "dr-isha-nair",
    name: "Dr. Isha Nair",
    qualifications: "BDS, Fellowship — Pediatric Dentistry",
    specialization: "Kids & Teen Dentistry",
    experience: 9,
    bio: "Loved by little patients for her patient, playful and pain-free approach.",
  },
  {
    id: "dr-vikram-shah",
    name: "Dr. Vikram Shah",
    qualifications: "BDS, MDS — Endodontics",
    specialization: "Root Canal Specialist",
    experience: 16,
    bio: "Single-sitting RCT expert with microscopic precision and zero-pain protocols.",
  },
];

export const testimonials = [
  {
    name: "Priya S.",
    role: "Whitening + Veneers",
    rating: 5,
    text: "I finally smile in pictures again. The team made it so calming — I didn't feel a thing. Worth every rupee.",
  },
  {
    name: "Arjun M.",
    role: "Dental Implant",
    rating: 5,
    text: "Lost a tooth in an accident. Got a permanent implant in two visits. Looks completely natural. Highly recommended.",
  },
  {
    name: "Neha & Kabir",
    role: "Pediatric Care",
    rating: 5,
    text: "My 6-year-old now asks when his next dentist visit is. Dr. Isha is a magician with kids.",
  },
  {
    name: "Rajiv K.",
    role: "Invisible Aligners",
    rating: 5,
    text: "18 months and my smile is transformed. Dr. Rohan was thorough at every step. Clean, modern clinic.",
  },
];

export const faqs = [
  { q: "Do I need an appointment or can I walk in?", a: "We strongly recommend booking online or via WhatsApp so we can assign you the best slot. Walk-ins are accommodated subject to availability." },
  { q: "Is the treatment painful?", a: "We use modern painless anesthesia, single-sitting protocols and laser dentistry wherever possible. The vast majority of our patients report a comfortable, anxiety-free experience." },
  { q: "Do you accept insurance and EMI?", a: "Yes. We accept all major dental insurance providers and offer 0% EMI on treatments above ₹10,000 with leading banks." },
  { q: "How sterile is the clinic?", a: "We follow CDC/ADA-grade sterilization with autoclave-sealed instruments per patient, fumigation cycles, single-use disposables and hospital-grade surface disinfection." },
  { q: "What does a smile makeover cost?", a: "Smile makeovers are personalized. After your digital smile design consult we share a transparent, itemized plan — typically starting from ₹40,000." },
  { q: "Are children welcome?", a: "Absolutely. Our pediatric specialist creates a fun, fear-free experience for kids aged 2–14." },
];

export const usps = [
  { title: "20+ Years", desc: "Trusted by 25,000+ happy patients across the city." },
  { title: "Painless Tech", desc: "Laser dentistry, micro-vision and modern anesthesia." },
  { title: "Sterile Care", desc: "Hospital-grade sterilization with sealed instruments." },
  { title: "Transparent", desc: "Itemized treatment plans. No hidden costs. EMI options." },
];
