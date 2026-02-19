'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

export function Header() {
    const t = useTranslations('Header')
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    BigBets Whitespaces
                </Link>
                <nav className={styles.nav}>
                    <Link href="/reports" className={styles.navLink}>
                        {t('reports')}
                    </Link>
                    <LanguageSwitcher />
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    )
}
