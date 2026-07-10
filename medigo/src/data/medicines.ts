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
    basePrice: number;
    imageUrl?: string;
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
    imageUrl: "/images/products/wegovy-injection-1-7mg.png",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4500, imageUrl: "/images/products/wegovy-injection-1-7mg.png" },
      { form: "Tablets", doses: ["1.5 mg", "3 mg", "7 mg", "14 mg"], basePrice: 3800, imageUrl: "/images/products/wegovy-tablets-1-5mg.jpg" },
    ]
  },
  {
    id: "med-ozempic",
    name: "Ozempic",
    category: "Semaglutide",
    description: "Once-weekly medicine for adults with type 2 diabetes to improve blood sugar, along with diet and exercise. Also used off-label for weight management.",
    imageUrl: "/images/products/glp-vial.png",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4200, imageUrl: "/images/products/glp-vial.png" },
      { form: "Tablets", doses: tabletDoses, basePrice: 3500, imageUrl: "/images/products/glp-oral-tablets.png" },
    ]
  },
  {
    id: "med-rybelsus",
    name: "Rybelsus",
    category: "Semaglutide",
    description: "A daily pill that works similarly to Ozempic, primarily for type 2 diabetes but increasingly utilized for effective weight management protocols.",
    imageUrl: "/images/products/glp-oral-tablets.png",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 4000, imageUrl: "/images/products/glp-vial.png" },
      { form: "Tablets", doses: tabletDoses, basePrice: 3200, imageUrl: "/images/products/glp-oral-tablets.png" },
    ]
  },
  {
    id: "med-mounjaro",
    name: "Mounjaro",
    category: "Tirzepatide",
    description: "A first-in-class medicine that activates both the GIP and GLP-1 receptors, offering significant improvements in glycemic control and body weight.",
    imageUrl: "/images/products/glp-vial.png",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 5200, imageUrl: "/images/products/glp-vial.png" },
      { form: "Tablets", doses: tabletDoses, basePrice: 4800, imageUrl: "/images/products/glp-oral-tablets.png" },
    ]
  },
  {
    id: "med-zepbound",
    name: "Zepbound",
    category: "Tirzepatide",
    description: "Zepbound is an injectable prescription medicine that may help adults with obesity or overweight to lose weight and keep it off.",
    imageUrl: "/images/products/zepbound-injection-2-5mg.png",
    variants: [
      { form: "Injection", doses: injectionDoses, basePrice: 5500, imageUrl: "/images/products/zepbound-injection-2-5mg.png" },
      { form: "Tablets", doses: tabletDoses, basePrice: 4900, imageUrl: "/images/products/glp-oral-tablets.png" },
    ]
  }
];
