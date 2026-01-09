import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/customers/route';
import { prismaMock } from '../../vitest.setup';
import { NextResponse } from 'next/server';

// Mock NextResponse.json
vi.mock('next/server', () => ({
    NextResponse: {
        json: vi.fn((data, init) => ({
            data,
            status: init?.status || 200,
            json: async () => data
        })),
    },
}));

/**
 * Integration tests for Customers API routes.
 * Covers the generation of the customer list by grouping vehicles by owner phone number.
 */
describe('Customers API Route', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    /**
     * Verifies that the GET /api/customers endpoint correctly groups multiple cars
     * under a single customer identity based on their phone number.
     */
    it('should return grouped customers from cars data', async () => {
        const mockCars = [
            {
                ownerName: 'John Doe',
                ownerPhone: '12345678',
                _count: { workOrders: 2 }
            },
            {
                ownerName: 'John Doe',
                ownerPhone: '12345678',
                _count: { workOrders: 1 }
            },
            {
                ownerName: 'Jane Smith',
                ownerPhone: '87654321',
                _count: { workOrders: 0 }
            }
        ];

        // Mock Prisma to return our predefined set of cars
        prismaMock.car.findMany.mockResolvedValue(mockCars as any);

        const response = await GET();
        const data = await response.json();

        // Should group 3 cars into 2 customers
        expect(data).toHaveLength(2);
        
        // Check John Doe (who has 2 cars)
        const john = data.find((c: any) => c.ownerPhone === '12345678');
        expect(john.ownerName).toBe('John Doe');
        expect(john.totalWorkOrders).toBe(3); // 2 + 1
        expect(john.cars).toHaveLength(2);

        // Check Jane Smith (who has 1 car)
        const jane = data.find((c: any) => c.ownerPhone === '87654321');
        expect(jane.ownerName).toBe('Jane Smith');
        expect(jane.totalWorkOrders).toBe(0);
        expect(jane.cars).toHaveLength(1);
    });

    /**
     * Verifies that the API handles database failures gracefully.
     */
    it('should return 500 error if prisma fails', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.car.findMany.mockRejectedValue(new Error('Prisma error'));

        const response = await GET();
        
        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data.error).toBe('Failed to fetch customers');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
