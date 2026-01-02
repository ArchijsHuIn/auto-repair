import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/cars/route';
import { GET as GET_BY_ID, PUT } from '@/app/api/cars/[id]/route';
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

describe('Cars API Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/cars', () => {
        it('should return all cars', async () => {
            const mockCars = [{ id: 1, make: 'Toyota' }, { id: 2, make: 'Honda' }];
            prismaMock.car.findMany.mockResolvedValue(mockCars);

            const request = new Request('http://localhost/api/cars');
            const response = await GET(request);
            const data = await response.json();

            expect(data).toEqual(mockCars);
            expect(prismaMock.car.findMany).toHaveBeenCalled();
        });

        it('should filter cars with open work orders', async () => {
            prismaMock.car.findMany.mockResolvedValue([]);

            const request = new Request('http://localhost/api/cars?hasOpenWork=true');
            await GET(request);

            expect(prismaMock.car.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    workOrders: {
                        some: {
                            status: { notIn: ["DONE", "CANCELLED"] },
                        },
                    },
                }
            }));
        });
    });

    describe('POST /api/cars', () => {
        it('should create a new car', async () => {
            const newCar = {
                licensePlate: 'ABC-123',
                make: 'Toyota',
                model: 'Corolla',
                ownerPhone: '12345678'
            };
            prismaMock.car.create.mockResolvedValue({ id: 1, ...newCar });

            const request = new Request('http://localhost/api/cars', {
                method: 'POST',
                body: JSON.stringify(newCar)
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBe(1);
            expect(prismaMock.car.create).toHaveBeenCalled();
        });

        it('should return 400 if required fields are missing', async () => {
            const request = new Request('http://localhost/api/cars', {
                method: 'POST',
                body: JSON.stringify({ make: 'Toyota' })
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Missing required fields');
        });
    });

    describe('GET /api/cars/[id]', () => {
        it('should return a car by id', async () => {
            const mockCar = { id: 1, make: 'Toyota', workOrders: [] };
            prismaMock.car.findUnique.mockResolvedValue(mockCar);

            const context = { params: Promise.resolve({ id: '1' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/cars/1'), context);
            const data = await response.json();

            expect(data.id).toBe(1);
            expect(prismaMock.car.findUnique).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 1 }
            }));
        });

        it('should return 404 if car not found', async () => {
            prismaMock.car.findUnique.mockResolvedValue(null);

            const context = { params: Promise.resolve({ id: '999' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/cars/999'), context);
            
            expect(response.status).toBe(404);
        });

        it('should return 500 if prisma fails', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            prismaMock.car.findUnique.mockRejectedValue(new Error('Database error'));

            const context = { params: Promise.resolve({ id: '1' }) };
            const response = await GET_BY_ID(new NextRequest('http://localhost/api/cars/1'), context);

            expect(response.status).toBe(500);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('PUT /api/cars/[id]', () => {
        it('should update a car', async () => {
            const updatedCar = {
                licensePlate: 'XYZ-789',
                make: 'Honda',
                model: 'Civic',
                ownerPhone: '87654321'
            };
            prismaMock.car.update.mockResolvedValue({ id: 1, ...updatedCar });

            const context = { params: Promise.resolve({ id: '1' }) };
            const request = new NextRequest('http://localhost/api/cars/1', {
                method: 'PUT',
                body: JSON.stringify(updatedCar)
            });
            const response = await PUT(request, context);
            const data = await response.json();

            expect(data.licensePlate).toBe('XYZ-789');
            expect(prismaMock.car.update).toHaveBeenCalled();
        });
    });
});
