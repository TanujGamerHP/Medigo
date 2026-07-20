"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  HeartPulse, 
  Check, 
  Award,
  AlertTriangle,
  BadgeCheck,
  TrendingDown,
  Activity,
  Heart,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { RadioCard } from "@/components/ui/RadioCard";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "metrics", label: "Body Metrics" },
  { id: "lifestyle", label: "Lifestyle Details" },
  { id: "health", label: "Medical History" },
  { id: "goals", label: "Weight Goals" },
  { id: "review", label: "Review Answers" },
  { id: "result", label: "AI Result" },
];

export function AssessmentWizard() {
  const router = useRouter();
  const { user } = useRole();
  const { show } = useToast();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Form State details
  const [formData, setFormData] = useState({
    age: 35,
    gender: "female",
    heightInches: 66, // 5ft 6in
    weightKg: 97,
    hasDiabetes: false,
    hasHypertension: false,
    hasHeartDisease: false,
    hasThyroidCancer: false,
    isPregnantOrBreastfeeding: false,
    currentMeds: "",
    priorWeightLossMeds: "",
    targetWeightKg: 72,
    timeframePreference: "moderate", // moderate, rapid
    activityLevel: "light", // sedentary, light, active
    dietType: "balanced", // balanced, low-carb, vegetarian
    sleepHours: 7,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const bmiDetails = useMemo(() => {
    const inches = formData.heightInches;
    const kg = formData.weightKg;
    if (inches === 0) return { bmi: 0, category: "N/A", color: "text-text-tertiary", percentage: 0 };

    const meters = inches * 0.0254;
    const bmiVal = kg / (meters * meters);
    const bmiRounded = Math.round(bmiVal * 10) / 10;

    let category = "Normal";
    let color = "text-success";
    if (bmiRounded < 18.5) {
      category = "Underweight";
      color = "text-amber-500";
    } else if (bmiRounded >= 18.5 && bmiRounded < 25) {
      category = "Normal";
      color = "text-success";
    } else if (bmiRounded >= 25 && bmiRounded < 30) {
      category = "Overweight";
      color = "text-amber-500";
    } else {
      category = "Severe Overweight";
      color = "text-error";
    }

    // Map BMI relative to a range of 15 to 45 for progress visualizer ring (0-100%)
    const minBmi = 15;
    const maxBmi = 45;
    const percentage = Math.min(Math.max(((bmiRounded - minBmi) / (maxBmi - minBmi)) * 100, 0), 100);

    return { bmi: bmiRounded, category, color, percentage };
  }, [formData.heightInches, formData.weightKg]);

  const hasContraindications = formData.hasThyroidCancer || formData.isPregnantOrBreastfeeding;

  const handleNext = async () => {
    if (currentStepIdx === STEPS.length - 2) {
      // Generating AI Result
      setIsSaving(true);
      if (user && user.role === "Patient") {
        try {
          const healthHistory: string[] = [];
          if (formData.hasDiabetes) healthHistory.push("Diabetes");
          if (formData.hasHypertension) healthHistory.push("Hypertension");
          if (formData.hasHeartDisease) healthHistory.push("Heart Disease");
          if (formData.hasThyroidCancer) healthHistory.push("Thyroid Cancer");
          if (formData.isPregnantOrBreastfeeding) healthHistory.push("Pregnant or Breastfeeding");

          await api.post("/api/v1/assessment/submit", {
            age: formData.age,
            gender: formData.gender,
            weight: formData.weightKg,
            height: formData.heightInches * 0.0254, // convert inches to meters
            healthHistory,
            currentMedications: formData.currentMeds || "None",
            targetWeight: formData.targetWeightKg,
            activityLevel: formData.activityLevel,
            dietType: formData.dietType,
            sleepHours: formData.sleepHours,
          });
          show("Assessment securely saved to your health record.", "success");
        } catch (err: any) {
          console.error("Failed to save assessment:", err);
          // Don't block the user, just let them see results
        }
      }
      setTimeout(() => {
        setIsSaving(false);
        setCurrentStepIdx((idx) => idx + 1);
      }, 1000);
    } else {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        if (currentStepIdx < STEPS.length - 1) {
          setCurrentStepIdx((idx) => idx + 1);
        }
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((idx) => idx - 1);
    }
  };

  const activeStepId = STEPS[currentStepIdx].id;

  return (
    <div className="space-y-8">
      
      {/* Stepper progress tracker */}
      <div className="flex justify-between items-center px-1 sm:px-4 relative w-full max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-border -translate-y-1/2 z-0" />
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIdx;
          const isActive = idx === currentStepIdx;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all border ${
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                    ? "bg-white border-primary text-primary ring-2 sm:ring-4 ring-primary/10"
                    : "bg-white border-border text-text-tertiary"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[9px] font-bold hidden sm:inline ${
                isActive ? "text-primary" : isCompleted ? "text-text-primary" : "text-text-tertiary"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Save indicator */}
      <div className="flex justify-center text-[10px] text-text-tertiary font-semibold gap-1 items-center">
        <Timer className="w-3.5 h-3.5" />
        <span>{isSaving ? "Autosaving answers..." : "All changes autosaved to portal"}</span>
      </div>

      {/* Main card box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-border/50 shadow-md p-5 sm:p-6 md:p-10 w-full max-w-2xl mx-auto min-h-[380px] flex flex-col justify-between">
        
        <div className="space-y-6">
          
          {/* STEP 1: PERSONAL INFO */}
          {activeStepId === "personal" && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">1. Personal Demographics</h3>
              
              <div className="space-y-5">
                <Slider
                  label="Age Eligibility"
                  min={18}
                  max={85}
                  value={formData.age}
                  onChange={(val) => setFormData({ ...formData, age: val })}
                  unit="years"
                />

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-text-primary block">Biological Sex *</span>
                  <RadioCard
                    name="gender"
                    selectedValue={formData.gender}
                    onChange={(val) => setFormData({ ...formData, gender: val })}
                    options={[
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BODY METRICS */}
          {activeStepId === "metrics" && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">2. Body Parameters</h3>
              
              <div className="space-y-6">
                <Slider
                  label="Height Selection"
                  min={48} // 4ft
                  max={84} // 7ft
                  value={formData.heightInches}
                  onChange={(val) => setFormData({ ...formData, heightInches: val })}
                  formatValue={(val) => {
                    const ft = Math.floor(val / 12);
                    const inc = val % 12;
                    return <>{ft} feet {inc} inches</>;
                  }}
                />
                
                <Slider
                  label="Current Body Weight"
                  min={40}
                  max={200}
                  value={formData.weightKg}
                  onChange={(val) => setFormData({ ...formData, weightKg: val })}
                  unit="kg"
                />

                {/* Live BMI indicator */}
                <div className="p-4 rounded-xl bg-background border border-border/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase block">Computed BMI</span>
                    <span className={`text-xl font-heading font-black ${bmiDetails.color}`}>
                      {bmiDetails.bmi}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase block">Weight Status</span>
                    <span className={`text-sm font-bold ${bmiDetails.color}`}>
                      {bmiDetails.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {activeStepId === "lifestyle" && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">3. Habitation & Lifestyle</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-text-primary block">Daily Physical Action</span>
                  <RadioCard
                    name="activity"
                    selectedValue={formData.activityLevel}
                    onChange={(val) => setFormData({ ...formData, activityLevel: val })}
                    options={[
                      { value: "sedentary", label: "Sedentary", description: "Desk job, little to no gym checkins" },
                      { value: "light", label: "Lightly Active", description: "Walks, active sports 1-2x / week" },
                      { value: "active", label: "Highly Active", description: "Gym workouts, running 3-5x / week" }
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-text-primary block">Intake Style</span>
                  <RadioCard
                    name="diet"
                    selectedValue={formData.dietType}
                    onChange={(val) => setFormData({ ...formData, dietType: val })}
                    options={[
                      { value: "balanced", label: "Balanced High-Protein" },
                      { value: "low-carb", label: "Low-Carb / Keto" },
                      { value: "vegetarian", label: "Vegetarian / Vegan" }
                    ]}
                  />
                </div>

                <Slider
                  label="Average Sleep Hours per Night"
                  min={0}
                  max={24}
                  value={formData.sleepHours}
                  onChange={(val) => setFormData({ ...formData, sleepHours: val })}
                  unit="hours"
                />
              </div>
            </div>
          )}

          {/* STEP 4: MEDICAL HISTORY */}
          {activeStepId === "health" && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">4. Medical History & Warnings</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Toggle clinical risk markers that apply to your history.</p>

              <div className="space-y-3.5">
                {[
                  { name: "hasDiabetes", label: "Diagnosed with Type 2 Diabetes" },
                  { name: "hasHypertension", label: "Diagnosed with High Blood Pressure" },
                  { name: "hasHeartDisease", label: "History of Cardiovascular conditions" },
                  { name: "hasThyroidCancer", label: "Family history of Medullary Thyroid Cancer (MTC) *", critical: true },
                  { name: "isPregnantOrBreastfeeding", label: "Currently pregnant or breastfeeding *", critical: true }
                ].map((item) => (
                  <label
                    key={item.name}
                    htmlFor={`check-${item.name}`}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-colors ${
                      item.critical && (formData as any)[item.name]
                        ? "bg-red-50/50 border-error"
                        : "bg-background border-border-light hover:bg-white"
                    }`}
                  >
                    <input
                      id={`check-${item.name}`}
                      type="checkbox"
                      checked={(formData as any)[item.name]}
                      onChange={(e) => setFormData({ ...formData, [item.name]: e.target.checked })}
                      className="w-5 h-5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary">{item.label}</span>
                      {item.critical && (
                        <span className="block text-[10px] text-error font-medium">Critical GLP-1 contraindication</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="space-y-2 pt-4">
                <span className="text-sm font-semibold text-text-primary block">Current Medications</span>
                <input
                  type="text"
                  placeholder="e.g. Metformin, Lisinopril, None"
                  value={formData.currentMeds}
                  onChange={(e) => setFormData({ ...formData, currentMeds: e.target.value })}
                  className="w-full p-3 text-sm rounded-xl border border-border-light focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 5: WEIGHT GOALS */}
          {activeStepId === "goals" && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">5. Weight Goals</h3>
              
              <div className="space-y-6">
                <Slider
                  label="Target Body Weight"
                  min={40}
                  max={200}
                  value={formData.targetWeightKg}
                  onChange={(val) => setFormData({ ...formData, targetWeightKg: val })}
                  unit="kg"
                />

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-text-primary block">Program Timeline Speed</span>
                  <RadioCard
                    name="timeline"
                    selectedValue={formData.timeframePreference}
                    onChange={(val) => setFormData({ ...formData, timeframePreference: val })}
                    options={[
                      { value: "moderate", label: "Moderate & Steady", description: "0.5-1 kg per week (Recommended by clinicians)" },
                      { value: "rapid", label: "Gradual Adaptation", description: "Long-term metabolic stability focus" }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW */}
          {activeStepId === "review" && (
            <div className="space-y-6 text-left">
              <h3 className="font-heading font-bold text-lg text-text-primary">6. Review Answers</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Confirm your baseline indicators before submission.</p>

              <div className="space-y-3.5 border-t border-border-light pt-4 text-xs text-text-secondary">
                <div className="flex justify-between border-b border-background pb-2">
                  <span>Age & Sex:</span>
                  <span className="text-text-primary font-semibold">{formData.age} years / {formData.gender}</span>
                </div>
                <div className="flex justify-between border-b border-background pb-2">
                  <span>Height / Current Weight:</span>
                  <span className="text-text-primary font-semibold">{Math.floor(formData.heightInches / 12)} feet {formData.heightInches % 12} inches / {formData.weightKg} kg</span>
                </div>
                <div className="flex justify-between border-b border-background pb-2">
                  <span>Calculated BMI status:</span>
                  <span className={`font-bold ${bmiDetails.color}`}>{bmiDetails.bmi} ({bmiDetails.category})</span>
                </div>
                <div className="flex justify-between border-b border-background pb-2">
                  <span>Risk Contraindications:</span>
                  <span className={`font-semibold ${hasContraindications ? "text-error" : "text-success"}`}>
                    {hasContraindications ? "Yes, warnings active" : "None identified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: RESULT */}
          {activeStepId === "result" && (
            <div className="space-y-8 text-center py-2">
              
              {(!hasContraindications && bmiDetails.bmi >= 27) ? (
                <>
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                      Initial Eligibility Approval
                    </span>
                    <h3 className="font-heading font-bold text-xl text-text-primary">
                      You Qualify for GLP-1 Therapy!
                    </h3>
                  </div>

                  {/* Circular progress gauge */}
                  <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#22C55E"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * bmiDetails.percentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-heading font-black text-text-primary leading-none">
                        {bmiDetails.bmi}
                      </span>
                      <span className="text-[9px] font-bold text-text-tertiary uppercase mt-1 leading-none">
                        {bmiDetails.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                    Obesity medical guidelines suggest Semaglutide once-weekly injections to manage cravings and target a metabolic goal of **{formData.targetWeightKg} kg**.
                  </p>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-primary-100/30 border border-primary-200/40 text-left space-y-2 max-w-md mx-auto">
                    <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-primary shrink-0" />
                      Doctor Visit Recommended
                    </h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Consult with a board-certified specialist virtually to verify metrics, review blood labs, and dispatch prescriptions directly to your home.
                    </p>
                  </div>
                </>
              ) : (
                /* Disqualified Warning */
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-error flex items-center justify-center mx-auto shadow-sm">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xl text-text-primary">
                      Eligibility Requirements Not Met
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                      {hasContraindications 
                        ? "Your assessment indicates clinical warnings regarding family thyroid cancer history or pregnancy/lactation. Safety is our priority."
                        : "Your calculated BMI is under 27. Clinical guidelines require a BMI of 27 or higher for GLP-1 prescription eligibility."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50/50 border border-error-200 text-left text-xs text-error-800 space-y-1">
                    <p className="font-bold text-text-primary">Medical Directive:</p>
                    <p className="text-text-secondary leading-relaxed text-[11px]">
                      {hasContraindications
                        ? "We recommend scheduling a clinical consultation with local endocrinology providers to audit non-peptide weight programs."
                        : "Focus on maintaining a balanced diet and regular exercise. GLP-1 medications are reserved for clinical obesity or overweight categories with comorbidities."}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Buttons flow */}
        <div className="pt-8 border-t border-border-light flex justify-between gap-4">
          <Button
            id="assess-back-btn"
            type="button"
            variant="outline"
            disabled={currentStepIdx === 0 || activeStepId === "result"}
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="py-3 px-3 sm:px-6 text-[11px] sm:text-xs font-bold shrink-0"
          >
            Back
          </Button>
          
          {activeStepId === "result" ? (
            <Button
              id="assess-finish-btn"
              onClick={() => {
                if (hasContraindications) {
                  router.push("/contact");
                } else {
                  router.push("/doctors");
                }
              }}
              className="py-3 text-xs font-bold gradient-cta text-white"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {hasContraindications ? "Speak with coordinator" : "Book doctor consult"}
            </Button>
          ) : (
            <Button
              id="assess-next-btn"
              onClick={handleNext}
              isLoading={isSaving}
              className="py-3 px-4 sm:px-6 text-[11px] sm:text-xs font-bold gradient-cta text-white whitespace-normal text-center leading-tight"
              rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
            >
              {currentStepIdx === STEPS.length - 2 ? "Generate AI Result" : "Continue"}
            </Button>
          )}
        </div>

      </div>

      {/* Security badges */}
      <div className="flex justify-center gap-6 text-[10px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
          HIPAA Protected Portal
        </span>
      </div>

    </div>
  );
}
