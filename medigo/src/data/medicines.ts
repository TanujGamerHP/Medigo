export interface MedicineBrand {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
}

export const MEDICINE_CATALOG: MedicineBrand[] = [
  {
    id: "med-wegovy-tab",
    name: "Wegovy® 1.5mg Tablets",
    category: "Semaglutide",
    description: "Wegovy (semaglutide) tablets, 1.5 mg. 30 tablets per bottle.",
    imageUrl: "/images/products/wegovy-tablets-1-5mg.jpg",
    price: 4999,
  },
  {
    id: "med-glp-oral",
    name: "Prescription GLP Medication (Oral)",
    category: "GLP-1 Oral",
    description: "Oral Dissolving Tablets. Compounded Medication for Medical Weight Management. Dose varies.",
    imageUrl: "/images/products/glp-oral-tablets.png",
    price: 3499,
  },
  {
    id: "med-glp-vial",
    name: "Prescription GLP Medication (Vial)",
    category: "GLP-1 Injection",
    description: "Prescription GLP Medication in a vial for injection. Dose varies.",
    imageUrl: "/images/products/glp-vial.png",
    price: 2999,
  },
  {
    id: "med-wegovy-inj",
    name: "Wegovy® 1.7mg Injection",
    category: "Semaglutide",
    description: "Wegovy (semaglutide) injection, 1.7 mg. Pre-filled pens.",
    imageUrl: "/images/products/wegovy-injection-1-7mg.png",
    price: 8999,
  },
  {
    id: "med-zepbound",
    name: "Zepbound™ 2.5mg Injection",
    category: "Tirzepatide",
    description: "Zepbound (tirzepatide) injection, 2.5 mg. Pre-filled pens.",
    imageUrl: "/images/products/zepbound-injection-2-5mg.png",
    price: 9999,
  }
];
