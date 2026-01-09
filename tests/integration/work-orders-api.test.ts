import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/work-orders/route';
import { GET as GET_BY_ID, PATCH } from '@/app/api/work-orders/[id]/route';
import { prismaMock } from '../../vitest.setup';
import { NextResponse, NextRequest } from 'next/server';

// Mock NextResponse.json
vi.mock('next/server', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        NextResponse: {
            json: vi.fn((data, init) => ({
                data,
                status: init?.status || 200,
                json: async () => data
            })),
        },
    };
});

/**
 * Integration tests for Work Orders API routes.
 * Covers listing, creating, fetching details, and updating work order status/payment.
 */
describe('Work Orders API Routes', () => {
    beforeEach(() => {
        // Clear all mock call history between tests
        vi.clearAllMocks();
    });

    /**
     * Tests for the GET /api/work-orders endpoint.
     */
    describe('GET /api/work-orders', () => {
        it('should return all work orders', async () => {
            const mockOrders = [{ id: 1, title: 'Brake Repair' }];
            // Setup mock to return a list of work orders
            prismaMock.work_Done.findMany.mockResolvedValue(mockOrders as any);

            const request = new NextRequest('http://localhost/api/work-orders');
            const response = await GET(request);
            const data = await response.json();

            expect(data).toEqual(mockOrders);
            expect(prismaMock.work_Done.findMany).toHaveBeenCalled();
        });
    });

    /**
     * Tests for the POST /api/work-orders endpoint.
     */
    describe('POST /api/work-orders', () => {
        it('should create a new work order for an existing car', async () => {
            const car = { id: 1, licensePlate: 'ABC-123' };
            const newOrder = {
                carId: 1,
                status: 'NEW',
                title: 'Oil Change',
                paymentStatus: 'UNPAID'
            };
            
            // Mock both car lookup and work order creation
            prismaMock.car.findUnique.mockResolvedValue(car as any);
            prismaMock.work_Done.create.mockResolvedValue({ id: 10, ...newOrder } as any);

            const request = new NextRequest('http://localhost/api/work-orders', {
                method: 'POST',
                body: JSON.stringify(newOrder)
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBe(10);
            expect(prismaMock.work_Done.create).toHaveBeenCalled();
        });

        it('should return 400 if required fields are missing', async () => {
            const request = new NextRequest('http://localhost/api/work-orders', {
                method: 'POST',
                body: JSON.stringify({ title: 'Broken pipe' }) // Missing carId/carLicensePlate, status, paymentStatus
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Missing required fields');
        });

        it('should return 404 if car is not found by ID', async () => {
            // Simulate car not found in database
            prismaMock.car.findUnique.mockResolvedValue(null);

            const request = new NextRequest('http://localhost/api/work-orders', {
                method: 'POST',
                body: JSON.stringify({
                    carId: 999,
                    status: 'NEW',
                    title: 'Oil Change',
                    paymentStatus: 'UNPAID'
                })
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.error).toBe('Car not found');
        });

        it('should return 404 if car is not found by license plate', async () => {
            prismaMock.car.findUnique.mockResolvedValue(null);

            const request = new NextRequest('http://localhost/api/work-orders', {
                method: 'POST',
                body: JSON.stringify({
                    carLicensePlate: 'NON-EXISTENT',
                    status: 'NEW',
                    title: 'Oil Change',
                    paymentStatus: 'UNPAID'
                })
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.error).toBe('Car not found for provided license plate');
        });

        it('should return 400 if neither carId nor carLicensePlate is provided', async () => {
            const request = new NextRequest('http://localhost/api/work-orders', {
                method: 'POST',
                body: JSON.stringify({
                    status: 'NEW',
                    title: 'Oil Change',
                    paymentStatus: 'UNPAID'
                })
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Missing required fields');
        });
    });

    /**
     * Tests for the GET /api/work-orders/[id] endpoint.
     */
    describe('GET /api/work-orders/[id]', () => {
        it('should return 400 if ID is not a number', async () => {
            const context = { params: Promise.resolve({ id: 'abc' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/work-orders/abc'), context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid work order ID');
        });

        it('should return a work order by id', async () => {
            const mockOrder = { id: 1, title: 'Brake Repair', car: {}, items: [] };
            prismaMock.work_Done.findUnique.mockResolvedValue(mockOrder as any);

            const context = { params: Promise.resolve({ id: '1' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/work-orders/1'), context);
            const data = await response.json();

            expect(data.id).toBe(1);
            expect(prismaMock.work_Done.findUnique).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 1 }
            }));
        });

        it('should return 500 if prisma fails', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            prismaMock.work_Done.findUnique.mockRejectedValue(new Error('Database error'));

            const context = { params: Promise.resolve({ id: '1' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/work-orders/1'), context);

            expect(response.status).toBe(500);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    /**
     * Tests for the PATCH /api/work-orders/[id] endpoint.
     */
    describe('PATCH /api/work-orders/[id]', () => {
        it('should return 400 if ID is not a number', async () => {
            const context = { params: Promise.resolve({ id: 'abc' }) };
            const request = new NextRequest('http://localhost/api/work-orders/abc', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'DONE' })
            });
            const response = await PATCH(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid work order ID');
        });

        it('should update a work order status to DONE and set completedAt', async () => {
            const mockUpdatedOrder = { id: 1, status: 'DONE', completedAt: new Date() };
            prismaMock.work_Done.update.mockResolvedValue(mockUpdatedOrder as any);

            const context = { params: Promise.resolve({ id: '1' }) };
            const request = new NextRequest('http://localhost/api/work-orders/1', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'DONE' })
            });
            const response = await PATCH(request, context);
            const data = await response.json();

            expect(data.status).toBe('DONE');
            // Check that the update call included the status change and current date
            expect(prismaMock.work_Done.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: 'DONE',
                    completedAt: expect.any(Date)
                })
            }));
        });
    });
});
