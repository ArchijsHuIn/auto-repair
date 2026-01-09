import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/work-orders/[id]/items/route';
import { PUT, DELETE } from '@/app/api/work-orders/[id]/items/[itemId]/route';
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
 * Integration tests for Work Order Items API routes.
 * Covers adding, updating, and deleting line items (parts or labor) within a work order.
 */
describe('Work Order Items API Routes', () => {
    beforeEach(() => {
        // Clear all mock call history between tests
        vi.clearAllMocks();
    });

    /**
     * Tests for the POST /api/work-orders/[id]/items endpoint.
     */
    describe('POST /api/work-orders/[id]/items', () => {
        it('should create a new work item', async () => {
            const newItem = {
                type: 'PART',
                description: 'Brake pads',
                quantity: 2,
                unitPrice: 25.50,
                total: 51.00
            };
            // Setup mock to return the created item
            prismaMock.work_Item_Used.create.mockResolvedValue({ id: 1, ...newItem, workOrderId: 10 } as any);

            const context = { params: Promise.resolve({ id: '10' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items', {
                method: 'POST',
                body: JSON.stringify(newItem)
            });
            const response = await POST(request, context);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBe(1);
            // Verify correct data was passed to Prisma
            expect(prismaMock.work_Item_Used.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    workOrderId: 10,
                    type: 'PART'
                })
            }));
        });

        it('should return 400 if required fields are missing', async () => {
            const context = { params: Promise.resolve({ id: '10' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items', {
                method: 'POST',
                body: JSON.stringify({ type: 'PART' }) // Missing description, quantity, unitPrice
            });
            const response = await POST(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Missing required fields');
        });

        it('should return 400 if work order ID is not a number', async () => {
            const context = { params: Promise.resolve({ id: 'abc' }) };
            const request = new NextRequest('http://localhost/api/work-orders/abc/items', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'PART',
                    description: 'Brake pads',
                    quantity: 2,
                    unitPrice: 25.50,
                    total: 51.00
                })
            });
            const response = await POST(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid work order ID');
        });
    });

    /**
     * Tests for the PUT /api/work-orders/[id]/items/[itemId] endpoint.
     */
    describe('PUT /api/work-orders/[id]/items/[itemId]', () => {
        it('should return 400 if item ID is not a number', async () => {
            const context = { params: Promise.resolve({ id: '10', itemId: 'abc' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items/abc', {
                method: 'PUT',
                body: JSON.stringify({ description: 'New description' })
            });
            const response = await PUT(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid item ID');
        });

        it('should update a work item', async () => {
            const updatedItem = {
                description: 'Premium Brake pads',
                quantity: 2,
                unitPrice: 30.00,
                total: 60.00
            };
            prismaMock.work_Item_Used.update.mockResolvedValue({ id: 1, ...updatedItem } as any);

            const context = { params: Promise.resolve({ id: '10', itemId: '1' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items/1', {
                method: 'PUT',
                body: JSON.stringify(updatedItem)
            });
            const response = await PUT(request, context);
            const data = await response.json();

            expect(data.description).toBe('Premium Brake pads');
            expect(prismaMock.work_Item_Used.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 1 }
            }));
        });
    });

    /**
     * Tests for the DELETE /api/work-orders/[id]/items/[itemId] endpoint.
     */
    describe('DELETE /api/work-orders/[id]/items/[itemId]', () => {
        it('should return 400 if item ID is not a number', async () => {
            const context = { params: Promise.resolve({ id: '10', itemId: 'abc' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items/abc', {
                method: 'DELETE'
            });
            const response = await DELETE(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid item ID');
        });

        it('should delete a work item', async () => {
            prismaMock.work_Item_Used.delete.mockResolvedValue({ id: 1 } as any);

            const context = { params: Promise.resolve({ id: '10', itemId: '1' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items/1', {
                method: 'DELETE'
            });
            const response = await DELETE(request, context);
            const data = await response.json();

            expect(data.success).toBe(true);
            expect(prismaMock.work_Item_Used.delete).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 1 }
            }));
        });
    });
});
