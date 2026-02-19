'use client'

import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion'
import { Calendar, Globe, MapPin, Users } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import styles from './StudyCard.module.css'

interface StudyCardProps {
    id: string
    industry: string
    region: string
    createdAt: string
    status: string
    index?: number
}

export function StudyCard({ id, industry, region, createdAt, status, index = 0 }: StudyCardProps) {
    const t = useTranslations('StudyCard')
    const locale = useLocale()

    const date = new Date(createdAt)
    const formattedDate = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date)

    const statusLabel = () => {
        switch (status) {
            case 'completed': return t('status_completed')
            case 'in_progress': return t('status_in_progress')
            case 'pending': return t('status_pending')
            case 'failed': return t('status_failed')
            default: return status
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Link href={`/reports/${id}`} className={styles.card}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{industry}</h3>
                    <span className={`${styles.status} ${styles[status]}`}>{statusLabel()}</span>
                </div>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <MapPin size={16} />
                        {region}
                    </div>
                    <div className={styles.metaItem}>
                        <Calendar size={16} />
                        {formattedDate}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
