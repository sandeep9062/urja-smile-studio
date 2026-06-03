import {
  Sparkles,
  Stethoscope,
  Smile,
  Baby,
  Scissors,
  Activity,
  Bluetooth,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CLINIC = {
  name: "Urja Dental Clinic",
  tagline: "Your Smile, Our Priority",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "https://wa.me/919876543210",
  email: "hello@urjadental.com",
  address: "123 Wellness Avenue, MG Road, Bengaluru 560001",
  hours: "Mon – Sat: 9:30 AM – 8:30 PM • Sun: 10:00 AM – 2:00 PM",
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  image: string;
  whoNeeds: string[];
  procedure: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "dental-implants",
    title: "Dental Implants",
    short: "Permanent, natural-looking tooth replacements that restore full function.",
    description:
      "Dental implants are titanium posts placed in the jawbone that act as roots for replacement teeth — the most durable, comfortable solution for missing teeth.",
    icon: Bluetooth,
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Adults with one or more missing teeth",
      "Patients with loose or ill-fitting dentures",
      "Anyone seeking a long-term alternative to bridges",
    ],
    procedure: [
      "Detailed consultation and 3D imaging",
      "Implant placement under local anaesthesia",
      "Healing period (osseointegration) of 3–6 months",
      "Custom abutment and crown fitting",
      "Final review and home-care guidance",
    ],
    faqs: [
      { q: "Is the procedure painful?", a: "No. It is done under local anaesthesia and most patients return to work the next day." },
      { q: "How long do implants last?", a: "With good hygiene, implants can last 20+ years — often a lifetime." },
      { q: "Am I a candidate?", a: "Most healthy adults qualify. We confirm with a quick scan and bone-density check." },
    ],
  },
  {
    slug: "root-canal-treatment",
    title: "Root Canal Treatment",
    short: "Save your natural tooth with our painless, single-sitting RCT.",
    description:
      "Modern root canal therapy removes infection from inside the tooth and seals it — preserving your natural smile and ending the pain.",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Severe or lingering toothache",
      "Sensitivity to hot or cold that lingers",
      "Deep decay or a cracked tooth",
    ],
    procedure: [
      "Digital X-ray and diagnosis",
      "Local anaesthesia for full comfort",
      "Cleaning and shaping of the canals",
      "Sealing with biocompatible material",
      "Crown placement to protect the tooth",
    ],
    faqs: [
      { q: "Will it hurt?", a: "Today's RCT is virtually painless — most patients report relief, not discomfort." },
      { q: "How many sittings?", a: "Most cases finish in a single visit of 45–90 minutes." },
    ],
  },
  {
    slug: "braces-aligners",
    title: "Braces & Aligners",
    short: "Straighten teeth invisibly with clear aligners or modern braces.",
    description:
      "We offer metal, ceramic, and clear aligner (Invisalign-style) options to gently move teeth into a confident, healthy alignment.",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Crooked, crowded, or gapped teeth",
      "Overbite, underbite, or crossbite",
      "Teens and adults seeking a discreet option",
    ],
    procedure: [
      "Smile assessment and digital scan",
      "Custom treatment plan with timeline",
      "Fitting of braces or aligners",
      "Regular adjustments every 4–6 weeks",
      "Retainer phase to lock in your smile",
    ],
    faqs: [
      { q: "How long does treatment take?", a: "Typically 6–18 months depending on case complexity." },
      { q: "Are aligners as effective as braces?", a: "For most cases, yes — and they are far more discreet and removable." },
    ],
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    short: "Brighten your smile up to 6 shades in a single comfortable visit.",
    description:
      "Our in-clinic professional whitening uses safe, enamel-friendly gels and accelerator lights for visible results in under an hour.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Stains from coffee, tea, or tobacco",
      "Anyone wanting a brighter event-ready smile",
      "Patients with healthy teeth and gums",
    ],
    procedure: [
      "Cleaning and shade assessment",
      "Gum protection barrier applied",
      "Whitening gel + activation light (20 min cycles)",
      "Post-care fluoride treatment",
    ],
    faqs: [
      { q: "Is it safe?", a: "Absolutely — performed under supervision with clinical-grade gels." },
      { q: "How long do results last?", a: "12–24 months with good care; touch-ups extend it further." },
    ],
  },
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    short: "Veneers, smile design, and contouring for a picture-perfect smile.",
    description:
      "From porcelain veneers to digital smile design, we craft natural-looking transformations tailored to your face and personality.",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Chipped, worn, or stained front teeth",
      "Uneven gum line or short teeth",
      "Anyone wanting a complete smile makeover",
    ],
    procedure: [
      "Digital smile design preview",
      "Minimal enamel preparation",
      "Custom porcelain veneer fabrication",
      "Precision bonding and polish",
    ],
    faqs: [
      { q: "Do veneers damage natural teeth?", a: "No — modern veneers need only minimal enamel reshaping." },
      { q: "How long do they last?", a: "10–15 years with good hygiene and routine check-ups." },
    ],
  },
  {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    short: "Gentle, anxiety-free dental care for our youngest patients.",
    description:
      "Our child-friendly clinic environment and specially trained team make every visit a happy one — building healthy habits for life.",
    icon: Baby,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Children from age 1 onwards",
      "First dental visits and check-ups",
      "Cavities, sealants, and fluoride care",
    ],
    procedure: [
      "Warm introduction and tour of the clinic",
      "Gentle examination and cleaning",
      "Cavity care or preventive sealants",
      "Parent counselling on diet and brushing",
    ],
    faqs: [
      { q: "When should my child's first visit be?", a: "By their first birthday or when the first tooth appears." },
      { q: "Do you handle nervous kids?", a: "Yes — our team specialises in calm, patient, fun-first care." },
    ],
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    short: "Wisdom tooth removal and surgical care with maximum comfort.",
    description:
      "From routine extractions to complex wisdom-tooth surgery, our surgical suite delivers safe, swift, and gentle outcomes.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Impacted or painful wisdom teeth",
      "Severely decayed or fractured teeth",
      "Pre-orthodontic extractions",
    ],
    procedure: [
      "3D scan and surgical planning",
      "Local or conscious sedation as needed",
      "Minimally invasive surgical extraction",
      "Stitches and detailed aftercare plan",
    ],
    faqs: [
      { q: "How long is the recovery?", a: "Most patients are back to normal within 2–3 days." },
      { q: "Will I be awake?", a: "Yes, under local anaesthesia — sedation is available for anxious patients." },
    ],
  },
  {
    slug: "gum-treatment",
    title: "Gum Treatment",
    short: "Stop bleeding gums and protect the foundation of your smile.",
    description:
      "Healthy gums are the foundation of healthy teeth. Our periodontal therapy treats gum disease and restores pink, firm tissue.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80",
    whoNeeds: [
      "Bleeding or swollen gums",
      "Receding gum line or tooth sensitivity",
      "Persistent bad breath",
    ],
    procedure: [
      "Periodontal charting and X-rays",
      "Deep cleaning (scaling and root planing)",
      "Laser-assisted disinfection where needed",
      "Maintenance plan every 3–6 months",
    ],
    faqs: [
      { q: "Is gum treatment painful?", a: "No — performed with anaesthesia and modern ultrasonic tools." },
      { q: "Can gum disease be reversed?", a: "Early stages, yes. Advanced stages can be managed effectively." },
    ],
  },
];

export type Doctor = {
  slug: string;
  name: string;
  degree: string;
  specialization: string;
  experience: string;
  image: string;
  bio: string;
};

export const DOCTORS: Doctor[] = [
  {
    slug: "dr-urja-sharma",
    name: "Dr. Urja Sharma",
    degree: "BDS, MDS (Prosthodontics)",
    specialization: "Implantologist & Smile Design",
    experience: "22+ years",
    image: "https://picsum.photos/seed/urja-doctor-1/600/700",
    bio: "Founder of Urja Dental, Dr. Sharma has placed over 5,000 dental implants and specialises in full-mouth rehabilitation.",
  },
  {
    slug: "dr-arjun-mehta",
    name: "Dr. Arjun Mehta",
    degree: "BDS, MDS (Orthodontics)",
    specialization: "Braces & Clear Aligners",
    experience: "14 years",
    image: "https://picsum.photos/seed/urja-doctor-2/600/700",
    bio: "Certified Invisalign provider known for treating complex bite cases with discreet, comfortable solutions.",
  },
  {
    slug: "dr-meera-iyer",
    name: "Dr. Meera Iyer",
    degree: "BDS, MDS (Pedodontics)",
    specialization: "Pediatric Dentistry",
    experience: "11 years",
    image: "https://picsum.photos/seed/urja-doctor-3/600/700",
    bio: "Loved by little patients — Dr. Meera makes every child's first visit fun, gentle, and fear-free.",
  },
  {
    slug: "dr-rohan-kapoor",
    name: "Dr. Rohan Kapoor",
    degree: "BDS, MDS (Endodontics)",
    specialization: "Root Canal Specialist",
    experience: "9 years",
    image: "https://picsum.photos/seed/urja-doctor-4/600/700",
    bio: "Expert in single-sitting microscopic root canals using state-of-the-art rotary endodontics.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya R.",
    treatment: "Dental Implants",
    rating: 5,
    date: "Mar 2026",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "After years of avoiding photos, I finally have my confidence back. The team was kind, the process painless, and the result better than I imagined.",
  },
  {
    name: "Vikram S.",
    treatment: "Root Canal",
    rating: 5,
    date: "Feb 2026",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "I was terrified going in. Dr. Kapoor finished my RCT in one sitting and I felt zero pain. Honestly the best dental experience of my life.",
  },
  {
    name: "Ananya M.",
    treatment: "Invisalign",
    rating: 5,
    date: "Jan 2026",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "Loved that no one could tell I was wearing aligners. My smile is straight, my bite feels great, and Dr. Mehta was an absolute pro.",
  },
  {
    name: "Karan D.",
    treatment: "Teeth Whitening",
    rating: 5,
    date: "Dec 2025",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    review:
      "One hour, six shades brighter. The wedding photos came out incredible. Highly recommend Urja for anyone wanting quick results.",
  },
  {
    name: "Neha P.",
    treatment: "Pediatric Care",
    rating: 5,
    date: "Nov 2025",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    review:
      "My 4-year-old actually asks to visit Dr. Meera. The clinic is so child-friendly — even cavity treatment was stress-free.",
  },
  {
    name: "Sahil K.",
    treatment: "Smile Design",
    rating: 5,
    date: "Oct 2025",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "Six veneers later and I cannot stop smiling. The digital preview helped me see the result before we started. Worth every rupee.",
  },
];

export const USPS = [
  { icon: Stethoscope, title: "20+ Years Experience", text: "Decades of trusted dental care" },

  { icon: Smile, title: "Pain-Free Treatment", text: "Modern, gentle, anxiety-free care" },
  { icon: Sparkles, title: "Advanced Equipment", text: "3D imaging, lasers & digital scans" },
];
