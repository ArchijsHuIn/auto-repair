import { describe, it, expect } from 'vitest';
import {
    translateWorkOrderStatus,
    translatePaymentStatus,
    translatePaymentMethod,
    translateWorkOrderItemType
} from '@/lib/translations';

/**
 * Unit tests for translation helper functions.
 * Ensures that English enum keys are correctly mapped to their Latvian equivalents.
 */
describe('translations', () => {
    /**
     * Tests for work order status translations (e.g., NEW, DONE).
     */
    describe('translateWorkOrderStatus', () => {
        it('should translate NEW to Jauns', () => {
            expect(translateWorkOrderStatus('NEW')).toBe('Jauns');
        });

        it('should return the original status if no translation exists', () => {
            expect(translateWorkOrderStatus('UNKNOWN')).toBe('UNKNOWN');
        });
    });

    /**
     * Tests for payment status translations (e.g., PAID, UNPAID).
     */
    describe('translatePaymentStatus', () => {
        it('should translate PAID to Apmaksāts', () => {
            expect(translatePaymentStatus('PAID')).toBe('Apmaksāts');
        });
    });

    /**
     * Tests for payment method translations (e.g., CASH, CARD).
     * Also handles null/undefined values.
     */
    describe('translatePaymentMethod', () => {
        it('should translate CASH to Skaidra nauda', () => {
            expect(translatePaymentMethod('CASH')).toBe('Skaidra nauda');
        });

        it('should return "Nav norādīts" for null or undefined', () => {
            expect(translatePaymentMethod(null)).toBe('Nav norādīts');
            expect(translatePaymentMethod(undefined)).toBe('Nav norādīts');
        });
    });

    /**
     * Tests for work order item type translations (e.g., LABOR, PART).
     */
    describe('translateWorkOrderItemType', () => {
        it('should translate LABOR to Darbs', () => {
            expect(translateWorkOrderItemType('LABOR')).toBe('Darbs');
        });
    });
});
