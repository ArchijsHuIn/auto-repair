import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/components/Footer';

/**
 * Unit tests for the Footer component.
 * Verifies that the footer displays the correct copyright information and social media links.
 */
describe('Footer', () => {
    /**
     * Test if the copyright text contains the current year.
     */
    it('renders the copyright text with the current year', () => {
        render(<Footer />);
        // Get the current year dynamically to match the component's output
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} AutoServiss informācijas sistēma`))).toBeInTheDocument();
    });

    /**
     * Test if the expected social media links are present in the footer.
     */
    it('renders social media links', () => {
        render(<Footer />);
        // Verify existence of key social platforms
        expect(screen.getByText('X (Twitter)')).toBeInTheDocument();
        expect(screen.getByText('Facebook')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });
});
