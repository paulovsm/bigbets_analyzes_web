import { supabase } from '@/lib/supabase'
import { StudyCard } from '@/components/StudyCard'
import { SearchInput } from '@/components/SearchInput'
import { RefreshStudiesButton } from '@/components/RefreshStudiesButton'
import { getTranslations } from 'next-intl/server'
import styles from './page.module.css'

// Mock data if DB connection fails
const MOCK_STUDIES = [
    {
        id: '1',
        target_industry: 'Inteligência Artificial Generativa',
        target_region: 'Global',
        created_at: new Date().toISOString(),
        status: 'completed'
    },
    {
        id: '2',
        target_industry: 'Energia Renovável',
        target_region: 'Brasil',
        created_at: new Date().toISOString(),
        status: 'in_progress'
    },
    {
        id: '3',
        target_industry: 'Varejo Autônomo',
        target_region: 'América Latina',
        created_at: new Date().toISOString(),
        status: 'pending'
    }
]

interface ReportsPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    const t = await getTranslations('ReportsPage')
    const { q } = await searchParams
    let studies = []

    try {
        if (q) {
            const { data, error } = await supabase
                .from('whitespace_studies')
                .select('*')
                .neq('status', 'deleted')
                .or(`target_industry.ilike.%${q}%,target_region.ilike.%${q}%`)
                .order('created_at', { ascending: false })

            if (error) throw error
            studies = data || []
        } else {
            const { data, error } = await supabase
                .from('whitespace_studies')
                .select('*')
                .neq('status', 'deleted')
                .order('created_at', { ascending: false })

            if (error) throw error
            studies = data || []
        }

    } catch (error) {
        console.error('Error fetching studies:', error)
        if (!q) studies = MOCK_STUDIES
        else studies = []
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchWrapper}>
                        <SearchInput />
                    </div>
                    <RefreshStudiesButton />
                </div>
            </header>

            <div className={styles.grid}>
                {studies.length > 0 ? (
                    studies.map((study: any, index: number) => (
                        <StudyCard
                            key={study.id}
                            id={study.id}
                            industry={study.target_industry}
                            region={study.target_region}
                            createdAt={study.created_at}
                            status={study.status}
                            index={index}
                        />
                    ))
                ) : (
                    <div className={styles.empty}>
                        <p>{t('no_reports')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
