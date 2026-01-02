import '@testing-library/jest-dom';
import { vi } from 'vitest';

export const prismaMock = {
    car: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    work_Done: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    work_Item_Used: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

vi.mock('@/lib/prisma', () => ({
    prisma: prismaMock,
}));

// Mock pg and @prisma/adapter-pg to avoid connection attempts during module initialization
vi.mock('pg', () => ({
    Pool: vi.fn(() => ({
        on: vi.fn(),
        connect: vi.fn(),
        query: vi.fn(),
        end: vi.fn(),
    })),
}));

vi.mock('@prisma/adapter-pg', () => ({
    PrismaPg: vi.fn(),
}));
