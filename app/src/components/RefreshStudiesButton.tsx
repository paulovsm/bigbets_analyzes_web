
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import styles from './RefreshStudiesButton.module.css'

export function RefreshStudiesButton() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true)
        router.refresh()
        // Artificial delay to show the animation and provide feedback
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }, [router])

    return (
        <button
            onClick={handleRefresh}
            className={styles.button}
            disabled={isRefreshing}
            title="Atualizar lista de estudos"
        >
            <RefreshCw size={18} className={isRefreshing ? styles.spinning : ''} />
            <span>Atualizar</span>
        </button>
    )
}
