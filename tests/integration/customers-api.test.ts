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

describe('Customers API Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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

        prismaMock.car.findMany.mockResolvedValue(mockCars);

        const response = await GET();
        const data = await response.json();

        expect(data).toHaveLength(2);
        
        const john = data.find((c: any) => c.ownerPhone === '12345678');
        expect(john.ownerName).toBe('John Doe');
        expect(john.totalWorkOrders).toBe(3);
        expect(john.cars).toHaveLength(2);

        const jane = data.find((c: any) => c.ownerPhone === '87654321');
        expect(jane.ownerName).toBe('Jane Smith');
        expect(jane.totalWorkOrders).toBe(0);
        expect(jane.cars).toHaveLength(1);
    });

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
