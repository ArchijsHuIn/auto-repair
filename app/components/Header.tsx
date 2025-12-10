"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
    const { t } = useI18n();
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        {t('nav.siteTitle')}
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link href="/" className="hover:text-blue-200 transition-colors">
                            {t('nav.home')}
                        </Link>
                        <Link href="/customers" className="hover:text-blue-200 transition-colors">
                            {t('nav.customers')}
                        </Link>
                        <Link href="/cars" className="hover:text-blue-200 transition-colors">
                            {t('nav.cars')}
                        </Link>
                        <Link href="/work-orders" className="hover:text-blue-200 transition-colors">
                            {t('nav.workOrders')}
                        </Link>
                        <Link href="/calendar" className="hover:text-blue-200 transition-colors">
                            {t('nav.calendar')}
                        </Link>
                        <Link href="/about" className="hover:text-blue-200 transition-colors">
                            {t('nav.about')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
        </header>
    );
}
