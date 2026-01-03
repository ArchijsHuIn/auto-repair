'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { href: '/', label: 'Sākumlapa' },
        { href: '/cars', label: 'Meklēt auto' },
        { href: '/cars/new', label: 'Reģistrēt auto' },
        { href: '/work-orders', label: 'Darba uzdevumi' },
        { href: '/about', label: 'Par' },
    ];

    return (
        <header className="shadow-lg relative z-50" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16 gap-4">
                    <Link href="/" className="text-2xl font-bold transition-opacity hover:opacity-90 whitespace-nowrap" onClick={closeMenu}>
                        AutoServiss
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <nav className="flex gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-medium transition-opacity hover:opacity-90"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-white/10">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-3 font-medium rounded-md hover:bg-black/10 transition-colors"
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}