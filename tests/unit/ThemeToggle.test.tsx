import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ThemeToggle from '@/components/ThemeToggle';
import React from 'react';

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        // Clear localStorage and document.documentElement.dataset
        localStorage.clear();
        delete document.documentElement.dataset.theme;
    });

    it('renders with default Light theme if no theme is set', () => {
        render(<ThemeToggle />);
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    it('toggles theme when clicked', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');

        fireEvent.click(button);
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('light');
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('initializes from document dataset', () => {
        document.documentElement.dataset.theme = 'dark';
        render(<ThemeToggle />);
        expect(screen.getByText('Dark')).toBeInTheDocument();
    });
});
