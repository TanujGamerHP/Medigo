export type MedicationCategory = "Semaglutide" | "Tirzepatide";
export type MedicationType = "Injection" | "Tablet";

export interface MedicineBrand {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  medicationType: MedicationType;
  description: string;
  imageUrl: string;
  dosages: string[];
  basePrice: number;
}

export const MEDICINE_CATALOG: MedicineBrand[] = [
  // Semaglutide
  {
    id: "med-wegovy",
    name: "Wegovy",
    genericName: "Semaglutide",
    category: "Semaglutide",
    medicationType: "Injection",
    description: "Prescription medication for adults with obesity or overweight with weight-related medical problems to help them lose weight and keep it off.",
    imageUrl: "/images/products/wegovy-injection-1-7mg.png",
    dosages: ["0.25 mg", "0.5 mg", "1 mg", "1.7 mg", "2.0 mg", "2.4 mg"],
    basePrice: 8999,
  },
  {
    id: "med-ozempic",
    name: "Ozempic",
    genericName: "Semaglutide",
    category: "Semaglutide",
    medicationType: "Tablet", // User requested: Wegovy and Zepbound are injections, rest are tablets
    description: "Once-weekly medicine for adults with type 2 diabetes to improve blood sugar, along with diet and exercise. Also used off-label for weight management.",
    imageUrl: "/images/products/glp-vial.png", // Assigned from Image 1 as per instructions
    dosages: ["0.25 mg", "0.5 mg", "1 mg", "2 mg"],
    basePrice: 4200,
  },
  {
    id: "med-rybelsus",
    name: "Rybelsus",
    genericName: "Semaglutide",
    category: "Semaglutide",
    medicationType: "Tablet",
    description: "A daily pill that works similarly to Ozempic, primarily for type 2 diabetes but increasingly utilized for effective weight management protocols.",
    imageUrl: "/images/products/glp-oral-tablets.png", // Assigned from Image 2 as per instructions
    dosages: ["3 mg", "7 mg", "14 mg"],
    basePrice: 3499,
  },
  
  // Tirzepatide
  {
    id: "med-mounjaro",
    name: "Mounjaro",
    genericName: "Tirzepatide",
    category: "Tirzepatide",
    medicationType: "Tablet", 
    description: "A first-in-class medicine that activates both the GIP and GLP-1 receptors, offering significant improvements in glycemic control and body weight.",
    imageUrl: "/images/products/wegovy-tablets-1-5mg.jpg", 
    dosages: ["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"],
    basePrice: 5200,
  },
  {
    id: "med-zepbound",
    name: "Zepbound",
    genericName: "Tirzepatide",
    category: "Tirzepatide",
    medicationType: "Injection",
    description: "Zepbound is an injectable prescription medicine that may help adults with obesity or overweight to lose weight and keep it off.",
    imageUrl: "/images/products/zepbound-injection-2-5mg.png", // Assigned from Image 5
    dosages: ["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"],
    basePrice: 9999,
  }
];
