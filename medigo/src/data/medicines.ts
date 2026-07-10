export type VariantForm = "Injection" | "Tablets";

export interface MedicineBrand {
  id: string;
  name: string;
  category: "Semaglutide" | "Tirzepatide";
  description: string;
  imageUrl?: string;
  variants: {
    form: VariantForm;
    doses: string[];
    basePrice: number; // Base price to which we can add a modifier based on dose if we wanted
  }[];
}

const injectionDoses = ["0.25 mg", "0.5 mg", "1 mg", "1.7 mg", "2.0 mg", "2.4 mg"];
const tabletDoses = ["3 mg", "7 mg", "14 mg"];

export const MEDICINE_CATALOG: MedicineBrand[] = [
  {
    id: "med-wegovy",
    name: "Wegovy",
    category: "Semaglutide",
    description: "Prescription medication for adults with obesity or overweight with weight-related medical problems to help them lose weight and keep it off.",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4500 },
      { form: "Tablets", doses: tabletDoses, basePrice: 3800 },
    ]
  },
  {
    id: "med-ozempic",
    name: "Ozempic",
    category: "Semaglutide",
    description: "Once-weekly medicine for adults with type 2 diabetes to improve blood sugar, along with diet and exercise. Also used off-label for weight management.",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4200 },
      { form: "Tablets", doses: tabletDoses, basePrice: 3500 },
    ]
  },
  {
    id: "med-rybelsus",
    name: "Rybelsus",
    category: "Semaglutide",
    description: "A daily pill that works similarly to Ozempic, primarily for type 2 diabetes but increasingly utilized for effective weight management protocols.",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4000 },
      { form: "Tablets", doses: tabletDoses, basePrice: 3200 },
    ]
  },
  {
    id: "med-mounjaro",
    name: "Mounjaro",
    category: "Tirzepatide",
    description: "A first-in-class medicine that activates both the GIP and GLP-1 receptors, offering significant improvements in glycemic control and body weight.",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 5200 },
      { form: "Tablets", doses: tabletDoses, basePrice: 4800 },
    ]
  },
  {
    id: "med-zepbound",
    name: "Zepbound",
    category: "Tirzepatide",
    description: "Zepbound is an injectable prescription medicine that may help adults with obesity or overweight to lose weight and keep it off.",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 5500 },
      { form: "Tablets", doses: tabletDoses, basePrice: 4900 },
    ]
  }
];
