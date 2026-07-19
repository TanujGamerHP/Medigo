const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module.js');
const { AppointmentsService } = require('./dist/appointments/appointments.service.js');
const { PrismaService } = require('./dist/database/prisma.service.js');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appointmentsService = app.get(AppointmentsService);
  const prisma = app.get(PrismaService);

  // Find an appointment
  const appointment = await prisma.appointment.findFirst({
    include: { patient: true }
  });

  if (!appointment) {
    console.log('No appointment found to test with.');
    await app.close();
    return;
  }

  const newLink = 'https://meet.google.com/test-link-' + Date.now();
  console.log('1. Doctor updating meeting link for appointment:', appointment.id);
  console.log('   New Link:', newLink);
  
  await appointmentsService.updateMeetingLink(appointment.id, newLink);

  console.log('\n2. Checking notifications for patient:', appointment.patient.userId);
  const notifications = await prisma.notification.findMany({
    where: { userId: appointment.patient.userId },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  if (notifications.length > 0) {
    console.log('\n✅ TEST PASSED: Notification was successfully created for the patient!');
    console.log('Notification Details:');
    console.log(JSON.stringify(notifications[0], null, 2));
  } else {
    console.log('\n❌ TEST FAILED: No notification found for the patient.');
  }

  await app.close();
}

bootstrap().catch(console.error);
