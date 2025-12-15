'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Globe, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Link href={`/reports/${id}`} className={styles.card}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{industry}</h3>
                    <span className={`${styles.status} ${styles[status]}`}>{statusLabel(status)}</span>
                </div>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <MapPin size={16} />
                        {region}
                    </div>
                    <div className={styles.metaItem}>
                        <Calendar size={16} />
                        {format(new Date(createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function statusLabel(status: string) {
    switch (status) {
        case 'completed': return 'Concluído'
        case 'in_progress': return 'Em Progresso'
        case 'pending': return 'Pendente'
        case 'failed': return 'Falhou'
        default: return status
    }
}
