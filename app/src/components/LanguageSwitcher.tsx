'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <select
            className={styles.select}
            value={locale}
            onChange={handleLocaleChange}
        >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
        </select>
    );
}
