const { z } = require('zod');

// Enum values mirror prisma/schema.prisma — keep them in step when it changes.
const AUDIT_TYPES = ['INTERNAL', 'EXTERNAL', 'SUPPLIER'];
const AUDIT_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const INCIDENT_SEVERITIES = ['NEAR_MISS', 'MINOR', 'MODERATE', 'MAJOR', 'FATALITY'];
const INCIDENT_STATUSES = ['REPORTED', 'INVESTIGATING', 'CAPA_IN_PROGRESS', 'CLOSED'];
const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
const CLIENT_STATUSES = ['TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED'];

// String-typed status columns (not Prisma enums) — kept as unions anyway so a
// typo can't quietly become a status nothing filters on.
const COMPLIANCE_STATUSES = ['open', 'in_progress', 'met', 'overdue'];
const APPROVAL_STATUSES = ['draft', 'pending_approval', 'approved', 'rejected'];
const FINDING_SEVERITIES = ['minor', 'major', 'critical'];
const FINDING_STATUSES = ['open', 'in_progress', 'closed'];
const CAPA_STATUSES = ['open', 'in_progress', 'verified', 'closed'];
const TRAINING_STATUSES = ['assigned', 'in_progress', 'completed', 'expired'];

const cuid = z.string().min(1);
const dateish = z.coerce.date();
const optionalDate = dateish.nullish();

// --- auth -------------------------------------------------------------------
const registerSchema = z.object({
  clientName: z.string().trim().min(1).max(200),
  jurisdiction: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(10, 'Password must be at least 10 characters').max(200),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// --- compliance -------------------------------------------------------------
const legalRegisterItemCreate = z.object({
  clientId: cuid.optional(),
  jurisdiction: z.string().trim().min(1).max(100),
  regulationRef: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(5000).nullish(),
  obligation: z.string().trim().min(1).max(5000),
  dueDate: optionalDate,
  status: z.enum(COMPLIANCE_STATUSES).optional(),
  evidenceUrl: z.string().trim().url().nullish(),
});

// --- documents --------------------------------------------------------------
const documentCreate = z.object({
  clientId: cuid.optional(),
  folderId: cuid.nullish(),
  title: z.string().trim().min(1).max(300),
  currentVersion: z.number().int().positive().optional(),
  storageKey: z.string().trim().min(1).max(500),
  expiryDate: optionalDate,
  approvalStatus: z.enum(APPROVAL_STATUSES).optional(),
  uploadedById: cuid,
});

// --- audits -----------------------------------------------------------------
const auditCreate = z.object({
  clientId: cuid.optional(),
  type: z.enum(AUDIT_TYPES),
  status: z.enum(AUDIT_STATUSES).optional(),
  title: z.string().trim().min(1).max(300),
  scheduledDate: dateish,
  createdById: cuid,
});

const checklistItemCreate = z.object({
  question: z.string().trim().min(1).max(1000),
  response: z.string().trim().max(2000).nullish(),
  evidenceUrl: z.string().trim().url().nullish(),
  order: z.number().int().min(0).optional(),
});

const findingCreate = z.object({
  description: z.string().trim().min(1).max(5000),
  severity: z.enum(FINDING_SEVERITIES),
  status: z.enum(FINDING_STATUSES).optional(),
});

// --- incidents --------------------------------------------------------------
const incidentCreate = z.object({
  clientId: cuid.optional(),
  reportedById: cuid,
  severity: z.enum(INCIDENT_SEVERITIES),
  status: z.enum(INCIDENT_STATUSES).optional(),
  location: z.string().trim().max(300).nullish(),
  description: z.string().trim().min(1).max(5000),
  occurredAt: dateish,
});

const investigationUpsert = z.object({
  investigatorId: cuid,
  method: z.string().trim().max(100).nullish(),
  rootCause: z.string().trim().max(5000).nullish(),
  findings: z.any().optional(),
  completedAt: optionalDate,
});

const capaCreate = z.object({
  description: z.string().trim().min(1).max(5000),
  ownerUserId: cuid.nullish(),
  dueDate: optionalDate,
  status: z.enum(CAPA_STATUSES).optional(),
});

// --- training ---------------------------------------------------------------
const courseCreate = z.object({
  clientId: cuid.optional(),
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(5000).nullish(),
  validityMonths: z.number().int().positive().nullish(),
});

const trainingRecordCreate = z.object({
  clientId: cuid.optional(),
  courseId: cuid,
  userId: cuid,
  completedAt: optionalDate,
  certificateUrl: z.string().trim().url().nullish(),
  expiryDate: optionalDate,
  status: z.enum(TRAINING_STATUSES).optional(),
});

// --- tasks ------------------------------------------------------------------
const taskCreate = z.object({
  clientId: cuid.optional(),
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(5000).nullish(),
  status: z.enum(TASK_STATUSES).optional(),
  assigneeId: cuid.nullish(),
  dueDate: optionalDate,
});

// --- admin ------------------------------------------------------------------
const clientCreate = z.object({
  name: z.string().trim().min(1).max(200),
  jurisdiction: z.string().trim().min(1).max(100),
  industry: z.string().trim().max(100).nullish(),
  status: z.enum(CLIENT_STATUSES).optional(),
});

const clientStatusUpdate = z.object({
  status: z.enum(CLIENT_STATUSES),
});

const templateProductCreate = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  priceCents: z.number().int().min(0),
  isSubscription: z.boolean().optional(),
  storageKey: z.string().trim().min(1).max(500),
});

// --- public contact ---------------------------------------------------------
const contactMessage = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email(),
  message: z.string().trim().min(1).max(5000),
});

/**
 * Turns a create schema into an update schema: every field optional, and
 * clientId stripped so an update can't retarget the tenant.
 */
function toUpdate(schema) {
  return schema.partial().omit({ clientId: true });
}

const documentFolderCreate = z.object({
  clientId: cuid.optional(),
  name: z.string().trim().min(1).max(200),
  parentId: cuid.nullish(),
});

const userCreateAdmin = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(10),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  role: z.enum(['CLIENT_ADMIN', 'CLIENT_USER']),
});

const userUpdateAdmin = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  role: z.enum(['CLIENT_ADMIN', 'CLIENT_USER']).optional(),
});

const userPermissionUpdate = z.array(
  z.object({
    module: z.string(),
    canView: z.boolean(),
    canCreate: z.boolean(),
    canEdit: z.boolean(),
    canDelete: z.boolean(),
  })
);

const orderCreate = z.object({
  email: z.string().trim().toLowerCase().email(),
  items: z.array(
    z.object({
      productId: cuid,
      priceCents: z.number().int().min(0),
    })
  ),
});


module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  legalRegisterItemCreate,
  legalRegisterItemUpdate: toUpdate(legalRegisterItemCreate),
  documentCreate,
  documentUpdate: toUpdate(documentCreate),
  auditCreate,
  auditUpdate: toUpdate(auditCreate),
  checklistItemCreate,
  checklistItemUpdate: checklistItemCreate.partial(),
  findingCreate,
  findingUpdate: findingCreate.partial(),
  incidentCreate,
  incidentUpdate: toUpdate(incidentCreate),
  investigationUpsert,
  capaCreate,
  capaUpdate: capaCreate.partial(),
  courseCreate,
  courseUpdate: toUpdate(courseCreate),
  trainingRecordCreate,
  trainingRecordUpdate: toUpdate(trainingRecordCreate),
  taskCreate,
  taskUpdate: toUpdate(taskCreate),
  clientCreate,
  clientStatusUpdate,
  templateProductCreate,
  templateProductUpdate: templateProductCreate.partial(),
  contactMessage,
  documentFolderCreate,
  userCreateAdmin,
  userUpdateAdmin,
  userPermissionUpdate,
  orderCreate,
};
