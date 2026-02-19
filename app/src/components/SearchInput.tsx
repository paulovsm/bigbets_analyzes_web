'use client'

import { Search, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/routing'
import { useEffect, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import styles from './SearchInput.module.css'

export function SearchInput() {
    const t = useTranslations('SearchInput')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get('q') || '')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQuery = searchParams.get('q') || ''
            if (value !== currentQuery) {
                const params = new URLSearchParams(searchParams.toString())
                if (value) {
                    params.set('q', value)
                } else {
                    params.delete('q')
                }
                startTransition(() => {
                    const query = params.toString() ? `?${params.toString()}` : ''
                    router.replace(`${pathname}${query}`)
                })
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [value, router, pathname, searchParams])

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.inputContainer}>
                <Search className={styles.icon} size={18} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={t('placeholder')}
                    className={styles.input}
                />
                {isPending && <Loader2 className={styles.spinner} size={16} />}
            </div>
        </div>
    )
}
