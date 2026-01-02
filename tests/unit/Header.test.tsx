import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/Header';
import React from 'react';

// Mock ThemeToggle as it uses client-side logic
vi.mock('@/components/ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

describe('Header Component', () => {
    it('renders the application name', () => {
        render(<Header />);
        expect(screen.getByText('AutoServiss')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Header />);
        expect(screen.getByText('Sākumlapa')).toBeInTheDocument();
        expect(screen.getByText('Meklēt auto')).toBeInTheDocument();
        expect(screen.getByText('Darba uzdevumi')).toBeInTheDocument();
    });

    it('renders the ThemeToggle component', () => {
        render(<Header />);
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
});
