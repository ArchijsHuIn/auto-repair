import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
                        🚗 Auto Repair Shop
                    </Link>
                    <nav className="flex gap-6">
                        <Link href="/" className="hover:text-blue-200 transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/cars" className="hover:text-blue-200 transition-colors font-medium">
                            Search Cars
                        </Link>
                        <Link href="/cars/new" className="hover:text-blue-200 transition-colors font-medium">
                            Register Vehicle
                        </Link>
                        <Link href="/work-orders" className="hover:text-blue-200 transition-colors font-medium">
                            Work Orders
                        </Link>
                        <Link href="/about" className="hover:text-blue-200 transition-colors font-medium">
                            About
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}