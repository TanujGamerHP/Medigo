const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillConnections() {
  console.log('Starting backfill for DoctorPatientConnection...');
  
  // Get all unique doctor-patient pairs from appointments
  const appointments = await prisma.appointment.findMany({
    select: {
      doctorId: true,
      patientId: true,
    }
  });

  // Get all unique doctor-patient pairs from prescriptions
  const prescriptions = await prisma.prescription.findMany({
    select: {
      doctorId: true,
      patientId: true,
    }
  });

  const uniquePairs = new Map();

  for (const appt of appointments) {
    if (appt.doctorId && appt.patientId) {
      uniquePairs.set(`${appt.doctorId}-${appt.patientId}`, { doctorId: appt.doctorId, patientId: appt.patientId });
    }
  }

  for (const rx of prescriptions) {
    if (rx.doctorId && rx.patientId) {
      uniquePairs.set(`${rx.doctorId}-${rx.patientId}`, { doctorId: rx.doctorId, patientId: rx.patientId });
    }
  }

  let createdCount = 0;

  for (const pair of uniquePairs.values()) {
    try {
      // Check if connection already exists to avoid unique constraint violation
      const existing = await prisma.doctorPatientConnection.findUnique({
        where: {
          doctorId_patientId: {
            doctorId: pair.doctorId,
            patientId: pair.patientId,
          }
        }
      });

      if (!existing) {
        await prisma.doctorPatientConnection.create({
          data: {
            doctorId: pair.doctorId,
            patientId: pair.patientId,
            status: 'Active',
          }
        });
        createdCount++;
      }
    } catch (e) {
      console.error(`Failed to backfill connection between Doctor ${pair.doctorId} and Patient ${pair.patientId}:`, e.message);
    }
  }

  console.log(`Backfill complete. Created ${createdCount} connections.`);
}

backfillConnections()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
