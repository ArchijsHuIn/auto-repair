import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ThemeToggle from '@/components/ThemeToggle';
import React from 'react';

/**
 * Unit tests for the ThemeToggle component.
 * Verifies theme state management, toggling functionality, and initialization from the environment.
 */
describe('ThemeToggle Component', () => {
    beforeEach(() => {
        // Clear localStorage and document.documentElement.dataset to ensure a clean state for each test
        localStorage.clear();
        delete document.documentElement.dataset.theme;
    });

    /**
     * Verifies that the component defaults to the Light theme when no preference is saved.
     */
    it('renders with default Light theme if no theme is set', () => {
        render(<ThemeToggle />);
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    /**
     * Verifies that clicking the button successfully toggles between Light and Dark themes.
     * Checks both the UI state and the side effects in localStorage and the document element.
     */
    it('toggles theme when clicked', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        // Toggle to Dark
        fireEvent.click(button);
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');

        // Toggle back to Light
        fireEvent.click(button);
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('light');
        expect(localStorage.getItem('theme')).toBe('light');
    });

    /**
     * Verifies that the component correctly reads the initial theme from the document's dataset.
     */
    it('initializes from document dataset', () => {
        // Pre-set the document theme
        document.documentElement.dataset.theme = 'dark';
        render(<ThemeToggle />);
        // Verify that the component reflects the pre-set theme
        expect(screen.getByText('Dark')).toBeInTheDocument();
    });
});
