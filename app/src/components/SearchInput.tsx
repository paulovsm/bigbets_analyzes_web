'use client'

import { Search, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import styles from './SearchInput.module.css'

export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get('q') || '')
    const [isPending, startTransition] = useTransition()

    // Simple debounce logic inside effect
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
                    router.replace(`/reports?${params.toString()}`)
                })
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [value, router, searchParams])

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.inputContainer}>
                <Search className={styles.icon} size={18} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Buscar estudos..."
                    className={styles.input}
                />
                {isPending && <Loader2 className={styles.spinner} size={16} />}
            </div>
        </div>
    )
}
