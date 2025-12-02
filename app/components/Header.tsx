import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        Auto Repair Shop
                    </Link>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-blue-200 transition-colors">
                            Home
                        </Link>
                        <Link href="/customers" className="hover:text-blue-200 transition-colors">
                            Customers
                        </Link>
                        <Link href="/cars" className="hover:text-blue-200 transition-colors">
                            Cars
                        </Link>
                        <Link href="/work-orders" className="hover:text-blue-200 transition-colors">
                            Work Orders
                        </Link>
                        <Link href="/calendar" className="hover:text-blue-200 transition-colors">
                            Calendar
                        </Link>
                        <Link href="/about" className="hover:text-blue-200 transition-colors">
                            About
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
