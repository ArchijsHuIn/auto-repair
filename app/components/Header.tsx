import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        Auto serviss
                    </Link>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-blue-200 transition-colors">
                            Sākums
                        </Link>
                        <Link href="/customers" className="hover:text-blue-200 transition-colors">
                            Klienti
                        </Link>
                        <Link href="/cars" className="hover:text-blue-200 transition-colors">
                            Automašīnas
                        </Link>
                        <Link href="/work-orders" className="hover:text-blue-200 transition-colors">
                            Darba uzdevumi
                        </Link>
                        <Link href="/calendar" className="hover:text-blue-200 transition-colors">
                            Kalendārs
                        </Link>
                        <Link href="/about" className="hover:text-blue-200 transition-colors">
                            Par mums
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
