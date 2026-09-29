// Jest manual mock for the Prisma client.
// This prevents tests from needing a real database connection.

const createMockFn = () => jest.fn().mockResolvedValue(null);

const mockPrisma = {
  userPermission: {
    findUnique: jest.fn().mockResolvedValue({ read: true, write: true, delete: true }),
    upsert: createMockFn(),
  },
  document: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
    delete: createMockFn(),
  },
  documentVersion: {
    create: createMockFn(),
    findMany: jest.fn().mockResolvedValue([]),
  },
  user: {
    findUnique: createMockFn(),
    findMany: jest.fn().mockResolvedValue([]),
    create: createMockFn(),
    update: createMockFn(),
  },
  client: {
    findUnique: createMockFn(),
    findMany: jest.fn().mockResolvedValue([]),
    create: createMockFn(),
  },
  report: {
    findMany: jest.fn().mockResolvedValue([]),
    create: createMockFn(),
    findUnique: createMockFn(),
  },
  $transaction: jest.fn((fn) => fn(mockPrisma)),
  $disconnect: jest.fn(),
};

module.exports = mockPrisma;
