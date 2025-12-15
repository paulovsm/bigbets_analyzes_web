'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { motion } from 'framer-motion'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.toggle}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute' }}
            >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
        </button>
    )
}
