import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/Header';
import React from 'react';

// Mock ThemeToggle as it uses client-side logic
vi.mock('@/components/ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

/**
 * Unit tests for the Header component.
 * Verifies that the header renders correctly, including navigation links and sub-components.
 */
describe('Header Component', () => {
    /**
     * Test if the brand name/logo is visible.
     */
    it('renders the application name', () => {
        render(<Header />);
        expect(screen.getByText('AutoServiss')).toBeInTheDocument();
    });

    /**
     * Test if the primary navigation links are rendered.
     */
    it('renders navigation links', () => {
        render(<Header />);
        // Verify key navigation entries
        expect(screen.getByText('Sākumlapa')).toBeInTheDocument();
        expect(screen.getByText('Meklēt auto')).toBeInTheDocument();
        expect(screen.getByText('Darba uzdevumi')).toBeInTheDocument();
    });

    /**
     * Test if the ThemeToggle component is included in the header.
     * The ThemeToggle is mocked for this test.
     */
    it('renders the ThemeToggle component', () => {
        render(<Header />);
        // Check if the mocked ThemeToggle is present in the document
        expect(screen.getAllByTestId('theme-toggle').length).toBeGreaterThan(0);
    });
});
