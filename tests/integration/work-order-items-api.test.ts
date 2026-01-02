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

describe('Work Order Items API Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/work-orders/[id]/items', () => {
        it('should create a new work item', async () => {
            const newItem = {
                type: 'PART',
                description: 'Brake pads',
                quantity: 2,
                unitPrice: 25.50,
                total: 51.00
            };
            prismaMock.work_Item_Used.create.mockResolvedValue({ id: 1, ...newItem, workOrderId: 10 });

            const context = { params: Promise.resolve({ id: '10' }) };
            const request = new NextRequest('http://localhost/api/work-orders/10/items', {
                method: 'POST',
                body: JSON.stringify(newItem)
            });
            const response = await POST(request, context);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBe(1);
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
                body: JSON.stringify({ type: 'PART' })
            });
            const response = await POST(request, context);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Missing required fields');
        });
    });

    describe('PUT /api/work-orders/[id]/items/[itemId]', () => {
        it('should update a work item', async () => {
            const updatedItem = {
                description: 'Premium Brake pads',
                quantity: 2,
                unitPrice: 30.00,
                total: 60.00
            };
            prismaMock.work_Item_Used.update.mockResolvedValue({ id: 1, ...updatedItem });

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

    describe('DELETE /api/work-orders/[id]/items/[itemId]', () => {
        it('should delete a work item', async () => {
            prismaMock.work_Item_Used.delete.mockResolvedValue({ id: 1 });

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
