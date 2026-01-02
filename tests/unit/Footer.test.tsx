import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/components/Footer';

describe('Footer', () => {
    it('renders the copyright text with the current year', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} AutoServiss informācijas sistēma`))).toBeInTheDocument();
    });

    it('renders social media links', () => {
        render(<Footer />);
        expect(screen.getByText('X (Twitter)')).toBeInTheDocument();
        expect(screen.getByText('Facebook')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });
});
