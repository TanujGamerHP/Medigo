"use client";
// Vercel Rebuild Trigger: Dynamic Directory Configuration Update


import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/features/shared/RoleProvider";
import { UpgradePlanModal } from "@/components/store/UpgradePlanModal";
import {
  ArrowRight,
  Shield,
  Clock,
  UserCheck,
  Stethoscope,
  TrendingDown,
  Brain,
  HeartPulse,
  Star,
  Check,
  ChevronDown,
  Zap,
  Pill,
  Activity,
  Users,
  Award,
  BadgeCheck,
  MessageCircle,
  CalendarCheck,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MEDICINE_CATALOG } from "@/data/medicines";
import { MedicineCard } from "@/components/store/MedicineCard";

/* ============================================
   Animation Variants
   ============================================ */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};


/* ============================================
   Section Wrapper Component
   ============================================ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ============================================
   Section Heading
   ============================================ */
function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 lg:mb-16 ${center ? "text-center" : ""}`}>
      {badge && (
        <motion.div variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            {badge}
          </span>
        </motion.div>
      )}
      <motion.h2
        variants={fadeInUp}
        className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto text-balance"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ============================================
   1. HERO SECTION
   ============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0" id="hero-3d-container">
        <HeroSceneLoader />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom w-full pt-24 pb-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-primary-700 mb-6">
              <HeartPulse className="w-4 h-4" />
              Doctor-Led Weight Management Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-text-primary"
          >
            Your weight loss journey{" "}
            <span className="gradient-text">guided by GLP-1 Experts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed"
          >
            Get personalized GLP-1 treatment plans from board-certified doctors.
            AI-powered assessments, expert consultations, and ongoing support —
            all from home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/assessment"
              id="hero-cta-primary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full gradient-cta text-white font-semibold text-lg shadow-glow hover:shadow-glow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/how-it-works"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-border text-text-primary font-semibold text-lg shadow-sm hover:shadow-md hover:border-primary/30 hover:scale-[1.02] transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Trust Micro-stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { value: "500+", label: "Board-Certified Doctors" },
              { value: "50K+", label: "Patients Treated" },
              { value: "94%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold gradient-text">
                  {stat.value}
                </span>
                <span className="text-sm text-text-secondary mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-tertiary">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Lazy Load 3D Scene
   ============================================ */
import dynamic from "next/dynamic";

const HeroSceneLoader = dynamic(
  () => import("@/components/three/HeroScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full gradient-hero opacity-50" />
    ),
  }
);

/* ============================================
   2. TRUST BAR
   ============================================ */
function TrustBar() {
  const logos = [
    "HIPAA Compliant",
    "FDA Approved Medications",
    "Board Certified",
    "256-bit Encryption",
    "Telehealth Licensed",
  ];

  return (
    <Section className="bg-white border-y border-border-light !py-8 lg:!py-10">
      <div className="container-custom">
        <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex items-center gap-2 text-text-secondary"
            >
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium whitespace-nowrap">{logo}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   3. PROBLEM SECTION
   ============================================ */
function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: "Long Wait Times",
      description:
        "Months of waiting for specialist appointments while your health continues to decline.",
    },
    {
      icon: UserCheck,
      title: "Generic Advice",
      description:
        "One-size-fits-all diet plans that don't account for your unique biology and lifestyle.",
    },
    {
      icon: TrendingDown,
      title: "Yo-Yo Results",
      description:
        "Temporary weight loss followed by frustrating regain without medical supervision.",
    },
    {
      icon: Brain,
      title: "Overwhelming Information",
      description:
        "Conflicting advice online making it impossible to know what actually works.",
    },
  ];

  return (
    <Section className="bg-background" id="problem-section">
      <div className="container-custom">
        <SectionHeading
          badge="The Problem"
          title="Weight Loss Shouldn't Be This Hard"
          subtitle="Traditional approaches leave millions struggling without proper medical guidance and support."
        />

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              variants={fadeInUp}
              className="group relative p-6 lg:p-8 rounded-2xl bg-white border border-border hover:border-error/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <problem.icon className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    {problem.title}
                  </h3>
                  <p className="mt-2 text-text-secondary leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-4xl font-bold text-border-light group-hover:text-error/10 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   4. SOLUTION SECTION
   ============================================ */
function SolutionSection() {
  const features = [
    {
      icon: Stethoscope,
      title: "Board-Certified Doctors",
      description: "Every patient is matched with a licensed obesity medicine specialist.",
    },
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our AI analyzes your health profile to recommend the perfect treatment plan.",
    },
    {
      icon: Pill,
      title: "FDA-Approved GLP-1s",
      description: "Clinically proven medications like Ozempic, Wegovy, and Mounjaro.",
    },
    {
      icon: Activity,
      title: "Continuous Monitoring",
      description: "Track your progress with real-time health metrics and doctor check-ins.",
    },
    {
      icon: MessageCircle,
      title: "AI Health Coach",
      description: "24/7 AI assistant for questions, motivation, and lifestyle guidance.",
    },
    {
      icon: Shield,
      title: "HIPAA Secure",
      description: "Enterprise-grade security protecting all your sensitive health data.",
    },
  ];

  return (
    <Section className="bg-white" id="solution-section">
      <div className="container-custom">
        <SectionHeading
          badge="Our Solution"
          title="MediGo Makes It Simple"
          subtitle="A complete, doctor-led weight management platform that combines medical expertise with cutting-edge technology."
        />

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              className="group p-6 lg:p-8 rounded-2xl bg-background hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary-soft flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                <feature.icon className="w-7 h-7 text-primary-700" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   5. HOW IT WORKS
   ============================================ */
function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    {
      step: 1,
      icon: ClipboardCheck,
      title: "Free Assessment",
      description: "Complete our AI-powered health assessment in under 5 minutes to see if you qualify.",
    },
    {
      step: 2,
      icon: UserCheck,
      title: "Doctor Match & Review",
      description: "A board-certified obesity medicine specialist reviews your profile to design a custom pathway.",
    },
    {
      step: 3,
      icon: CalendarCheck,
      title: "Virtual Consultation",
      description: "Meet your doctor via a secure video call to discuss your biology and health goals.",
    },
    {
      step: 4,
      icon: TrendingDown,
      title: "Start Losing Weight",
      description: "Begin your personalized GLP-1 program with medication delivered to your door and ongoing support.",
    },
  ];

  return (
    <Section className="bg-background" id="how-it-works">
      <div className="container-custom overflow-hidden">
        <SectionHeading
          badge="How It Works"
          title="4 Simple Steps to Start"
          subtitle="From assessment to treatment in as little as 48 hours."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mt-16 max-w-5xl mx-auto"
          ref={containerRef}
        >
          {/* Animated Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-primary-100 -translate-x-1/2 rounded-full overflow-hidden z-0">
             <motion.div 
               className="w-full bg-primary origin-top"
               style={{ height: lineHeight }}
             />
          </div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="relative flex items-center mb-16 last:mb-0 w-full"
              >
                {/* Desktop: Content alternates left/right. Mobile: Content always on right */}
                <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-16' : 'md:pl-16 md:ml-auto'} pl-24 md:pl-0`}>
                  <div className={`text-left ${isEven ? 'md:text-right' : 'md:text-left'} bg-white p-6 md:p-8 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 relative z-10 w-full`}>
                    <span className="text-sm font-bold text-primary mb-2 block uppercase tracking-wider">Phase 0{step.step}</span>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon in Center (Desktop) or Left (Mobile) */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full gradient-cta flex items-center justify-center shadow-glow z-20 text-white border-4 border-background">
                  <step.icon className="w-6 h-6" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 text-center">
          <Link
            href="/how-it-works"
            id="how-it-works-cta"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full gradient-cta text-white font-semibold shadow-glow hover:shadow-glow-lg hover:scale-[1.03] transition-all duration-300 z-10 relative"
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   5.5. FEATURED MEDICINES
   ============================================ */
function FeaturedMedicines() {
  const router = useRouter();
  const { user } = useRole();
  const [modalReason, setModalReason] = useState<string | null>(null);

  const memberships = user?.patient?.memberships || [];
  const activeMembership = memberships.find((m: any) => m.status === 'Active') || (memberships.length > 0 ? memberships[0] : null);
  const planName = activeMembership?.planName?.toLowerCase() || "";

  // Helper to determine restriction string
  const getRestrictionReason = (medicine: MedicineBrand) => {
    if (!activeMembership) {
      return "Active membership required to purchase medication";
    }
    // "basic" plan (₹2499) blocks injections
    // Assuming 2499 plan is named "Basic" or "1-month". Let's check for "basic" or "1-month".
    const isBasicTier = planName.includes("basic") || planName.includes("1-month") || planName === "month";
    if (isBasicTier && medicine.medicationType === "Injection") {
      return "Please upgrade to Standard or Premium to buy injectable medications.";
    }
    return undefined; // Allowed
  };

  const handleBuyNow = () => {
    router.push("/store");
  };

  const handleRestrictedClick = (reason: string) => {
    setModalReason(reason);
  };

  const semaglutide = MEDICINE_CATALOG.filter(m => m.category === "Semaglutide");
  const tirzepatide = MEDICINE_CATALOG.filter(m => m.category === "Tirzepatide");

  return (
    <Section className="bg-[#FAFAFA] border-t border-border overflow-hidden" id="featured-medicines">
      <div className="container-custom relative">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Premium Catalog</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              GLP-1 Medications
            </h2>
            <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
              Choose your medication by category, brand and dosage. Clinically proven treatments delivered directly to your door.
            </p>
          </div>
          <Link 
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full border border-gray-200 shadow-sm hover:border-primary hover:text-primary transition-all duration-300 w-fit"
          >
            View All Medications
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-24">
          {/* Section 1: Semaglutide */}
          {semaglutide.length > 0 && (
            <section>
              <div className="mb-8 border-b border-gray-200 pb-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Semaglutide</h3>
              </div>
              
              {/* Mobile: Horizontally Scrollable, Desktop: Grid */}
              <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 relative">
                <div className="flex sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar">
                  {semaglutide.map((medicine, i) => (
                    <motion.div
                      key={medicine.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="snap-center shrink-0 w-[85vw] sm:w-auto"
                    >
                      <MedicineCard 
                        medicine={medicine} 
                        onSelect={handleBuyNow}
                        onRestrictedClick={handleRestrictedClick}
                        disabledReason={getRestrictionReason(medicine)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Tirzepatide */}
          {tirzepatide.length > 0 && (
            <section>
              <div className="mb-8 border-b border-gray-200 pb-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Tirzepatide</h3>
              </div>
              
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 relative">
                <div className="flex sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar">
                  {tirzepatide.map((medicine, i) => (
                    <motion.div
                      key={medicine.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="snap-center shrink-0 w-[85vw] sm:w-auto"
                    >
                      <MedicineCard 
                        medicine={medicine} 
                        onSelect={handleBuyNow}
                        onRestrictedClick={handleRestrictedClick}
                        disabledReason={getRestrictionReason(medicine)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <UpgradePlanModal 
        isOpen={!!modalReason} 
        onClose={() => setModalReason(null)} 
        reason={modalReason || ""} 
      />
    </Section>
  );
}

/* ============================================
   6. FEATURED DOCTORS
   ============================================ */
function MeetOurTeam() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await api.get('/api/v1/doctors');
        if (res.success && res.data) {
          // Take first 4 doctors
          setDoctors(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <Section className="bg-white" id="featured-doctors">
      <div className="container-custom">
        <SectionHeading
          badge="Our Doctors"
          title="Meet Your Care Team"
          subtitle="Board-certified specialists with decades of experience in weight management."
        />
        {doctors.length > 0 && (
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id || doctor.name}
                variants={scaleIn}
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto rounded-full gradient-cta flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
                  {doctor.profileImage ? (
                    <img src={doctor.profileImage} alt={doctor.firstName} className="w-full h-full object-cover" />
                  ) : (
                    (doctor.firstName?.[0] || "") + (doctor.lastName?.[0] || "")
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-primary font-medium text-sm mt-1">
                    {doctor.specialization || "General"}
                  </p>
                  <p className="text-text-tertiary text-sm mt-1">
                    {doctor.experience || "0 years"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-semibold text-sm">4.9</span>
                    <span className="text-text-tertiary text-sm">
                      (Verified)
                    </span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Verified
                  </div>

                  <Link href="/doctors" className="block w-full">
                    <Button
                      variant="outline"
                      fullWidth
                      className="mt-6 border-border hover:border-primary hover:text-primary transition-colors text-xs"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="mt-10 text-center">
          <Link
            href="/doctors"
            id="view-all-doctors"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
          >
            View All Doctors
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   7. GLP-1 EDUCATION
   ============================================ */
function GLP1Education() {
  const facts = [
    { value: "15-20%", label: "Average body weight reduction with GLP-1 medications" },
    { value: "FDA", label: "Approved for chronic weight management" },
    { value: "72 wks", label: "STEP trial duration proving long-term efficacy" },
    { value: "2x", label: "More effective than lifestyle changes alone" },
  ];

  return (
    <Section className="gradient-hero" id="glp1-education">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              badge="GLP-1 Education"
              title="What Are GLP-1 Medications?"
              subtitle="GLP-1 receptor agonists are a breakthrough class of medications that help regulate appetite and blood sugar, leading to significant and sustainable weight loss."
              center={false}
            />

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                "Reduces appetite by mimicking natural gut hormones",
                "Slows gastric emptying for longer-lasting fullness",
                "Improves insulin sensitivity and blood sugar control",
                "Clinically proven in large-scale randomized trials",
                "Prescribed and monitored by licensed physicians",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-text-secondary">{point}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/programs"
                id="learn-glp1-cta"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full gradient-cta text-white font-semibold shadow-glow hover:shadow-glow-lg hover:scale-[1.03] transition-all duration-300"
              >
                Explore GLP-1 Programs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4"
          >
            {facts.map((fact) => (
              <motion.div
                key={fact.label}
                variants={scaleIn}
                className="p-6 rounded-2xl glass text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {fact.value}
                </div>
                <p className="mt-2 text-sm text-text-secondary">{fact.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ============================================
   8. BENEFITS GRID (Bento)
   ============================================ */
function BenefitsGrid() {
  const benefits = [
    {
      icon: Clock,
      title: "48-Hour Start",
      description: "From assessment to treatment in as little as two days.",
      span: "md:col-span-1",
    },
    {
      icon: Stethoscope,
      title: "Expert Care",
      description: "Board-certified doctors specializing in obesity medicine.",
      span: "md:col-span-1",
    },
    {
      icon: Shield,
      title: "100% Private",
      description: "HIPAA-compliant platform with end-to-end encryption.",
      span: "md:col-span-1",
    },
    {
      icon: Activity,
      title: "Progress Tracking",
      description: "Real-time health dashboards with weight, BMI, and metabolic markers.",
      span: "md:col-span-2",
    },
    {
      icon: HeartPulse,
      title: "Ongoing Support",
      description: "Regular check-ins, dosage adjustments, and 24/7 AI health coaching.",
      span: "md:col-span-1",
    },
  ];

  return (
    <Section className="bg-white" id="benefits">
      <div className="container-custom">
        <SectionHeading
          badge="Benefits"
          title="Why Patients Choose MediGo"
          subtitle="Everything you need for a successful weight loss journey, in one platform."
        />

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={fadeInUp}
              className={`group p-6 lg:p-8 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${benefit.span}`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-text-primary">
                {benefit.title}
              </h3>
              <p className="mt-2 text-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   9. SUCCESS STORIES
   ============================================ */
function SuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.request("/api/v1/reviews/public");
        setStories(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <Section className="bg-background" id="success-stories">
      <div className="container-custom">
        <SectionHeading
          badge="Success Stories"
          title="Real Results from Real Patients"
          subtitle="Thousands have transformed their health with MediGo's doctor-led programs."
        />

        {loading ? (
          <div className="text-center text-text-tertiary">Loading testimonials...</div>
        ) : stories.length === 0 ? (
          <div className="text-center text-text-tertiary">No featured reviews yet.</div>
        ) : (
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                variants={fadeInUp}
                className="p-6 lg:p-8 rounded-2xl bg-white border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Images Before/After Preview */}
                {(story.beforeImage || story.afterImage) && (
                  <div className="flex gap-2 mb-4 h-24 overflow-hidden rounded-xl bg-slate-100">
                    {story.beforeImage && (
                      <div className="flex-1 relative group">
                        <img src={story.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">Before</span>
                      </div>
                    )}
                    {story.afterImage && (
                      <div className="flex-1 relative group">
                        <img src={story.afterImage} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-green-500/80 text-white text-[10px] px-1 rounded">After</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-warning text-warning"
                    />
                  ))}
                </div>

                <blockquote className="text-text-secondary leading-relaxed italic text-sm">
                  &ldquo;{story.reviewText}&rdquo;
                </blockquote>

                <div className="mt-6 pt-6 border-t border-border-light flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {story.profileImage ? (
                       <img src={story.profileImage} alt={story.patientName} className="w-10 h-10 rounded-full object-cover border border-border" />
                    ) : (
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                         {story.patientName?.charAt(0)}
                       </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-text-primary text-sm">
                        {story.patientName}
                      </p>
                      <p className="text-[10px] text-text-tertiary">Age {story.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      -{story.weightLossKg}kg
                    </p>
                    <p className="text-[10px] text-text-tertiary">
                      in {story.durationMonths} months
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/reviews"}
            className="font-bold border-primary text-primary hover:bg-primary/5"
          >
            See All 5-Star Reviews
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ============================================
   10. PRICING PREVIEW
   ============================================ */
function PricingPreview() {
  const plans = [
    {
      name: "MediGo Care – 1 Month",
      price: 2499,
      period: "",
      description: "Perfect to get started",
      features: [
        "Initial doctor consultation",
        "AI health assessment",
        "Basic GLP-1 prescription",
        "Personalised diet plan",
        "Personalised workout plan",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "MediGo Care – 3 Months",
      price: 6999,
      period: "",
      description: "Most patients start seeing meaningful results in 3 months.",
      features: [
        "Everything in 1 Month, PLUS:",
        "Bi-weekly doctor calls",
        "Personalised diet plan every 15days",
        "Personalised workout plan every 15 days",
        "Priority medication delivery",
        "WhatsApp Priority Support",
      ],
      popular: true,
    },
    {
      name: "MediGo Care – 6 Months",
      price: 12999,
      period: "",
      description: "Best value for long-term health transformation.",
      features: [
        "Everything in 3 Months, PLUS:",
        "Weekly doctor sessions",
        "Personalised diet plan every week",
        "Personalised workout plan every week",
        "Advanced Nutrition Coaching",
        "Free Lab Report Reviews",
      ],
      popular: false,
    },
  ];

  return (
    <Section className="bg-white" id="pricing-preview">
      <div className="container-custom">
        <SectionHeading
          badge="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="No hidden fees. Cancel anytime. All plans include FDA-approved GLP-1 medications."
        />

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={scaleIn}
              className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular
                  ? "border-primary bg-primary-50 shadow-glow"
                  : "border-border bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-cta text-white text-xs font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="font-heading text-xl font-bold text-text-primary">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {plan.description}
              </p>

              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-text-primary">
                  ₹{plan.price}
                </span>
                <span className="ml-1 text-text-secondary">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`mt-6 block w-full text-center py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? "gradient-cta text-white shadow-glow hover:shadow-glow-lg"
                    : "bg-background border border-border text-text-primary hover:border-primary hover:text-primary"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ============================================
   11. FAQ SECTION
   ============================================ */
function FAQSection() {
  const faqs = [
    {
      question: "What are GLP-1 medications?",
      answer:
        "GLP-1 receptor agonists are FDA-approved medications that mimic natural hormones to reduce appetite, slow digestion, and improve blood sugar control. They include brands like Ozempic, Wegovy, and Mounjaro.",
    },
    {
      question: "How quickly can I start treatment?",
      answer:
        "After completing your free assessment, you can be matched with a doctor and have your first consultation within 48 hours. If approved, medication can be shipped the same week.",
    },
    {
      question: "Is this covered by insurance?",
      answer:
        "Many insurance plans cover GLP-1 medications for weight management. Our team can help verify your coverage and explore manufacturer savings programs.",
    },
    {
      question: "Are there side effects?",
      answer:
        "Common side effects include mild nausea, which typically subsides within the first few weeks. Your doctor will monitor you closely and adjust dosing as needed to minimize discomfort.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, all MediGo plans are month-to-month with no long-term contracts. You can cancel or change your plan at any time through your dashboard.",
    },
  ];

  return (
    <Section className="bg-background" id="faq-section">
      <div className="container-custom max-w-3xl">
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about MediGo and GLP-1 treatment."
        />

        <motion.div variants={staggerContainer} className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10 text-center">
          <p className="text-text-secondary">
            Still have questions?{" "}
            <Link
              href="/faq"
              className="text-primary font-semibold hover:underline"
            >
              View all FAQs
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="text-primary font-semibold hover:underline"
            >
              contact us
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-2xl bg-white border border-border overflow-hidden hover:border-primary/20 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-heading font-semibold text-text-primary pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 lg:px-6 pb-5 lg:pb-6 text-text-secondary leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

import React from "react";

/* ============================================
   12. FINAL CTA
   ============================================ */
function FinalCTA() {
  return (
    <Section className="bg-dark-green relative overflow-hidden" id="final-cta">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-light blur-[120px]" />
      </div>

      <div className="relative z-10 container-custom text-center">
        <motion.div variants={scaleIn}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold mb-6">
            <HeartPulse className="w-4 h-4" />
            Start Your Transformation
          </span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
        >
          Ready to Take Control of
          <br />
          Your Health?
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mt-5 text-lg text-white/70 max-w-xl mx-auto"
        >
          Join 50,000+ patients who have transformed their lives with
          doctor-guided GLP-1 programs. Your free assessment takes just 5
          minutes.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/assessment"
            id="final-cta-primary"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-dark-green font-bold text-lg shadow-2xl hover:shadow-glow-lg hover:scale-[1.03] transition-all duration-300"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            id="final-cta-secondary"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Talk to a Specialist
          </Link>
        </motion.div>

        <motion.p variants={fadeIn} className="mt-6 text-sm text-white/50">
          No credit card required • Free cancellation • HIPAA compliant
        </motion.p>
      </div>
    </Section>
  );
}

/* ============================================
   HOMEPAGE — MAIN EXPORT
   ============================================ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <FeaturedMedicines />
      <MeetOurTeam />
      <GLP1Education />
      <BenefitsGrid />
      <SuccessStories />
      <PricingPreview />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
