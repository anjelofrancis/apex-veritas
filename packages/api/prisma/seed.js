/* eslint-disable no-console */
/**
 * Development seed — two tenants plus internal staff, so the portal has real
 * numbers to render and cross-tenant isolation is actually observable.
 *
 * Idempotent: re-running deletes every seeded tenant (cascade) and rebuilds.
 * Safe to run repeatedly against a dev database; never point it at production.
 *
 *   npm run prisma:seed --workspace=packages/api
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Every seeded account shares this password — dev fixtures only.
const DEMO_PASSWORD = 'Passw0rd!demo';

const TENANT_NAMES = ['Rift Valley Cement Ltd', 'Gulf Marine Services FZE'];
const STAFF_EMAILS = ['admin@apexveritas.io', 'consultant@apexveritas.io'];

/** Days from today, as a Date. Negative is in the past. */
function daysOut(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function reset() {
  const doomed = await prisma.client.findMany({
    where: { name: { in: TENANT_NAMES } },
    select: { id: true },
  });
  const clientIds = doomed.map((c) => c.id);

  if (clientIds.length) {
    // IncidentInvestigation.investigator has no onDelete rule, so it defaults
    // to RESTRICT and blocks the Client cascade from removing its users.
    // Clear investigations first, then the cascade runs unobstructed.
    await prisma.incidentInvestigation.deleteMany({
      where: { incident: { clientId: { in: clientIds } } },
    });
  }

  // Clients cascade to everything tenant-scoped; staff have no clientId so
  // they're removed by email. TemplateProduct is platform-wide.
  await prisma.client.deleteMany({ where: { name: { in: TENANT_NAMES } } });
  await prisma.user.deleteMany({ where: { email: { in: STAFF_EMAILS } } });
  await prisma.templateProduct.deleteMany({});
}

async function seedInternalStaff(passwordHash) {
  await prisma.user.create({
    data: {
      email: STAFF_EMAILS[0],
      passwordHash,
      firstName: 'Amina',
      lastName: 'Okoth',
      role: 'SUPER_ADMIN',
    },
  });
  await prisma.user.create({
    data: {
      email: STAFF_EMAILS[1],
      passwordHash,
      firstName: 'Daniel',
      lastName: 'Mwangi',
      role: 'CONSULTANT',
    },
  });
}

/**
 * Builds one fully-populated tenant. `profile` varies the numbers so the two
 * tenants look visibly different in the dashboard.
 */
async function seedTenant(profile, passwordHash) {
  const client = await prisma.client.create({
    data: {
      name: profile.name,
      jurisdiction: profile.jurisdiction,
      industry: profile.industry,
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.user.create({
    data: {
      clientId: client.id,
      email: profile.adminEmail,
      passwordHash,
      firstName: profile.adminFirst,
      lastName: profile.adminLast,
      role: 'CLIENT_ADMIN',
    },
  });

  // A scoped sub-user, to exercise the UserPermission override path.
  const subUser = await prisma.user.create({
    data: {
      clientId: client.id,
      email: profile.userEmail,
      passwordHash,
      firstName: profile.userFirst,
      lastName: profile.userLast,
      role: 'CLIENT_USER',
    },
  });

  await prisma.userPermission.createMany({
    data: ['compliance', 'documents', 'audits', 'incidents', 'training', 'tasks', 'reports'].map(
      (module) => ({
        userId: subUser.id,
        module,
        canView: true,
        canCreate: module === 'incidents',
        canEdit: false,
        canDelete: false,
      }),
    ),
  });

  await prisma.subscription.create({
    data: {
      clientId: client.id,
      planTier: profile.planTier,
      status: 'ACTIVE',
      currentPeriodEnd: daysOut(60),
    },
  });

  // --- legal register: spread across all four statuses -----------------------
  const obligations = [
    ['OSHA 2007 s.6', 'Annual workplace safety audit', 'met', -40],
    ['OSHA 2007 s.11', 'Fire safety certificate renewal', 'open', 21],
    ['EMCA 1999 s.58', 'Environmental impact assessment licence', 'open', 45],
    ['EMCA 1999 s.87', 'Effluent discharge permit', 'overdue', -12],
    ['WIBA 2007 s.7', 'Employee injury benefits cover', 'met', -90],
    ['OSHA 2007 s.47', 'Machinery examination certificate', 'in_progress', 14],
    ['NEMA Waste Regs 2006', 'Hazardous waste transport licence', 'overdue', -5],
    ['OSHA 2007 s.9', 'Safety and health committee minutes', 'open', 30],
    ['ISO 45001 cl.9.2', 'Internal audit programme', 'in_progress', 7],
    ['ISO 14001 cl.9.3', 'Management review records', 'open', 60],
    ['Factories Act Cap 514', 'Pressure vessel inspection', 'overdue', -22],
    ['OSHA 2007 s.21', 'First aider certification refresh', 'met', -15],
  ];

  await prisma.legalRegisterItem.createMany({
    data: obligations.slice(0, profile.obligationCount).map(([ref, title, status, due]) => ({
      clientId: client.id,
      jurisdiction: profile.jurisdiction,
      regulationRef: ref,
      title,
      obligation: `Maintain evidence of compliance with ${ref}.`,
      status,
      dueDate: daysOut(due),
    })),
  });

  // --- compliance score history: a visible trend ----------------------------
  await prisma.complianceScoreHistory.createMany({
    data: profile.scores.map((score, i) => ({
      clientId: client.id,
      score,
      recordedAt: daysOut(-((profile.scores.length - i) * 30)),
    })),
  });

  // --- audits, with checklist items and a finding + CAPA --------------------
  const audit = await prisma.audit.create({
    data: {
      clientId: client.id,
      type: 'INTERNAL',
      status: 'COMPLETED',
      title: 'ISO 45001 internal audit — Q2',
      scheduledDate: daysOut(-25),
      createdById: admin.id,
    },
  });

  await prisma.auditChecklistItem.createMany({
    data: [
      ['Are emergency exits unobstructed?', 'pass', 0],
      ['Is PPE issued and logged for all site staff?', 'pass', 1],
      ['Are chemical safety data sheets current?', 'fail', 2],
      ['Is the permit-to-work system in use?', 'pass', 3],
    ].map(([question, response, order]) => ({ auditId: audit.id, question, response, order })),
  });

  const finding = await prisma.auditFinding.create({
    data: {
      auditId: audit.id,
      description: 'Chemical safety data sheets for three solvents are out of date.',
      severity: 'major',
      status: 'open',
    },
  });

  await prisma.capaAction.create({
    data: {
      auditFindingId: finding.id,
      description: 'Obtain current SDS from supplier and refile in the chemical register.',
      ownerUserId: admin.id,
      dueDate: daysOut(10),
      status: 'in_progress',
    },
  });

  await prisma.audit.create({
    data: {
      clientId: client.id,
      type: 'EXTERNAL',
      status: 'SCHEDULED',
      title: 'Surveillance audit — certification body',
      scheduledDate: daysOut(35),
      createdById: admin.id,
    },
  });

  // --- incidents, one with a full investigation ----------------------------
  const incident = await prisma.incident.create({
    data: {
      clientId: client.id,
      reportedById: subUser.id,
      severity: 'MINOR',
      status: 'INVESTIGATING',
      location: profile.incidentLocation,
      description: 'Operative sustained a hand laceration while changing a cutting blade.',
      occurredAt: daysOut(-8),
    },
  });

  await prisma.incidentInvestigation.create({
    data: {
      incidentId: incident.id,
      investigatorId: admin.id,
      method: '5-why',
      rootCause: 'Blade-change procedure did not require lockout of the drive motor.',
      findings: {
        why1: 'Operative cut hand on blade',
        why2: 'Blade moved during change',
        why3: 'Drive motor was still energised',
        why4: 'Procedure did not require lockout',
        why5: 'Procedure written before LOTO policy adopted',
      },
      completedAt: daysOut(-2),
    },
  });

  await prisma.capaAction.create({
    data: {
      incidentId: incident.id,
      description: 'Revise blade-change SOP to mandate lockout/tagout; retrain all operators.',
      ownerUserId: admin.id,
      dueDate: daysOut(18),
      status: 'open',
    },
  });

  await prisma.incident.create({
    data: {
      clientId: client.id,
      reportedById: subUser.id,
      severity: 'NEAR_MISS',
      status: 'CLOSED',
      location: profile.incidentLocation,
      description: 'Forklift reversed close to a pedestrian walkway; no contact made.',
      occurredAt: daysOut(-30),
    },
  });

  // --- training -------------------------------------------------------------
  const course = await prisma.course.create({
    data: {
      clientId: client.id,
      title: 'Working at Height — Level 2',
      description: 'Fall protection, harness inspection and rescue planning.',
      validityMonths: 24,
    },
  });

  await prisma.trainingRecord.createMany({
    data: [
      { userId: admin.id, status: 'completed', completedAt: daysOut(-120), expiryDate: daysOut(610) },
      { userId: subUser.id, status: 'in_progress', completedAt: null, expiryDate: null },
    ].map((r) => ({ ...r, clientId: client.id, courseId: course.id })),
  });

  // --- tasks ----------------------------------------------------------------
  await prisma.task.createMany({
    data: [
      ['Renew fire safety certificate', 'TODO', admin.id, 21],
      ['Close out SDS audit finding', 'IN_PROGRESS', admin.id, 10],
      ['Schedule Q3 toolbox talks', 'TODO', subUser.id, 25],
      ['Submit effluent discharge return', 'BLOCKED', admin.id, -5],
      ['File WIBA renewal evidence', 'DONE', admin.id, -30],
    ].map(([title, status, assigneeId, due]) => ({
      clientId: client.id,
      title,
      status,
      assigneeId,
      dueDate: daysOut(due),
    })),
  });

  // --- documents (metadata only — no S3 upload wired yet) -------------------
  const folder = await prisma.documentFolder.create({
    data: { clientId: client.id, name: 'HSEQ Management System' },
  });

  await prisma.document.createMany({
    data: [
      ['HSE Policy Statement', 'approved', 400],
      ['Emergency Response Plan', 'approved', 180],
      ['Chemical Register', 'pending_approval', 45],
    ].map(([title, approvalStatus, expiryIn]) => ({
      clientId: client.id,
      folderId: folder.id,
      title,
      storageKey: `seed/${client.id}/${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      approvalStatus,
      expiryDate: daysOut(expiryIn),
      uploadedById: admin.id,
    })),
  });

  await prisma.notification.create({
    data: {
      clientId: client.id,
      userId: admin.id,
      channel: 'in_app',
      title: 'Effluent discharge permit overdue',
      body: 'The permit under EMCA 1999 s.87 passed its due date. Upload renewal evidence.',
    },
  });

  return { client, admin, subUser };
}

async function seedTemplateStore() {
  // Prices are KES minor units, so KES 45,000 is 4_500_000 — not 45000.
  await prisma.templateProduct.createMany({
    data: [
      ['ISO 45001 Documentation Pack', 'ISO Systems', 4_500_000, 'templates/iso45001-pack.zip'],
      ['Risk Assessment Template Bundle', 'Risk', 1_200_000, 'templates/risk-bundle.zip'],
      ['Contractor Prequalification Pack', 'Tender', 2_500_000, 'templates/contractor-pack.zip'],
    ].map(([name, category, priceCents, storageKey]) => ({
      name,
      category,
      priceCents,
      storageKey,
    })),
  });
}

async function main() {
  console.log('Resetting seeded data…');
  await reset();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  console.log('Seeding internal staff…');
  await seedInternalStaff(passwordHash);

  console.log('Seeding tenant 1…');
  await seedTenant(
    {
      name: TENANT_NAMES[0],
      jurisdiction: 'Kenya',
      industry: 'Manufacturing',
      planTier: 'PROFESSIONAL',
      adminEmail: 'admin@riftvalleycement.co.ke',
      adminFirst: 'Grace',
      adminLast: 'Wanjiru',
      userEmail: 'supervisor@riftvalleycement.co.ke',
      userFirst: 'Peter',
      userLast: 'Kimani',
      incidentLocation: 'Packing Plant — Line 2',
      obligationCount: 12,
      scores: [61, 68, 74, 79, 83],
    },
    passwordHash,
  );

  console.log('Seeding tenant 2…');
  await seedTenant(
    {
      name: TENANT_NAMES[1],
      jurisdiction: 'UAE',
      industry: 'Marine Services',
      planTier: 'ENTERPRISE',
      adminEmail: 'admin@gulfmarine.ae',
      adminFirst: 'Yusuf',
      adminLast: 'Al-Hashimi',
      userEmail: 'hse@gulfmarine.ae',
      userFirst: 'Layla',
      userLast: 'Haddad',
      incidentLocation: 'Dry Dock 3',
      obligationCount: 8,
      scores: [55, 59, 64, 71],
    },
    passwordHash,
  );

  console.log('Seeding template store…');
  await seedTemplateStore();

  console.log('\nSeed complete. Log in at http://localhost:5173/login\n');
  console.log(`  Password for every seeded account:  ${DEMO_PASSWORD}\n`);
  console.log('  admin@riftvalleycement.co.ke     CLIENT_ADMIN  (Kenya, 12 obligations)');
  console.log('  supervisor@riftvalleycement.co.ke CLIENT_USER   (scoped permissions)');
  console.log('  admin@gulfmarine.ae              CLIENT_ADMIN  (UAE, 8 obligations)');
  console.log('  admin@apexveritas.io             SUPER_ADMIN');
  console.log('  consultant@apexveritas.io        CONSULTANT\n');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
