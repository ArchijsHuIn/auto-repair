import { describe, it, expect } from 'vitest';
import {
    translateWorkOrderStatus,
    translatePaymentStatus,
    translatePaymentMethod,
    translateWorkOrderItemType
} from '@/lib/translations';

describe('translations', () => {
    describe('translateWorkOrderStatus', () => {
        it('should translate NEW to Jauns', () => {
            expect(translateWorkOrderStatus('NEW')).toBe('Jauns');
        });

        it('should return the original status if no translation exists', () => {
            expect(translateWorkOrderStatus('UNKNOWN')).toBe('UNKNOWN');
        });
    });

    describe('translatePaymentStatus', () => {
        it('should translate PAID to Apmaksāts', () => {
            expect(translatePaymentStatus('PAID')).toBe('Apmaksāts');
        });
    });

    describe('translatePaymentMethod', () => {
        it('should translate CASH to Skaidra nauda', () => {
            expect(translatePaymentMethod('CASH')).toBe('Skaidra nauda');
        });

        it('should return "Nav norādīts" for null or undefined', () => {
            expect(translatePaymentMethod(null)).toBe('Nav norādīts');
            expect(translatePaymentMethod(undefined)).toBe('Nav norādīts');
        });
    });

    describe('translateWorkOrderItemType', () => {
        it('should translate LABOR to Darbs', () => {
            expect(translateWorkOrderItemType('LABOR')).toBe('Darbs');
        });
    });
});
