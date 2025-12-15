'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import styles from './Header.module.css'

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    BigBets Whitespaces
                </Link>
                <nav className={styles.nav}>
                    <Link href="/reports" className={styles.navLink}>
                        Relatórios
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    )
}
