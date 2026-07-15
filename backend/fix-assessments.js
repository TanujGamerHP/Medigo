const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const patients = await prisma.patient.findMany({
    include: { assessments: true }
  });

  for (const patient of patients) {
    if (!patient.weight || !patient.height) continue;
    
    // height is in cm
    const heightInMeters = patient.height / 100;
    const bmi = parseFloat((patient.weight / (heightInMeters * heightInMeters)).toFixed(2));
    
    let result = 'Normal Weight';
    let recommendation = 'Maintain a balanced diet and regular physical activity.';

    if (bmi >= 30) {
      result = 'Severe Overweight';
      recommendation = 'Recommended for Wegovy / Mounjaro medical weight management programs.';
    } else if (bmi >= 25) {
      result = 'Overweight';
      recommendation = 'Recommended for Semaglutide (Ozempic) weight loss programs.';
    } else if (bmi < 18.5) {
      result = 'Underweight';
      recommendation = 'Recommended for personalized nutritional therapy.';
    }
    
    for (const assessment of patient.assessments) {
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: {
          bmi,
          assessmentScore: Math.round(bmi),
          result,
          recommendation
        }
      });
      console.log(`Updated assessment ${assessment.id} for patient ${patient.id} - BMI: ${bmi}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
