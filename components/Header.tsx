import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="shadow-lg" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center gap-4">
                    <Link href="/" className="text-2xl font-bold transition-opacity hover:opacity-90">
                        Auto Repair Shop
                    </Link>
                    <div className="flex items-center gap-4">
                        <nav className="flex gap-6">
                            <Link href="/" className="font-medium transition-opacity hover:opacity-90">
                                Home
                            </Link>
                            <Link href="/cars" className="font-medium transition-opacity hover:opacity-90">
                                Search Cars
                            </Link>
                            <Link href="/cars/new" className="font-medium transition-opacity hover:opacity-90">
                                Register Vehicle
                            </Link>
                            <Link href="/work-orders" className="font-medium transition-opacity hover:opacity-90">
                                Work Orders
                            </Link>
                            <Link href="/about" className="font-medium transition-opacity hover:opacity-90">
                                About
                            </Link>
                        </nav>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}