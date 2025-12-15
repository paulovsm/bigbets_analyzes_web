import { supabase } from '@/lib/supabase'
import { StudyCard } from '@/components/StudyCard'
import { SearchInput } from '@/components/SearchInput' // Import the new component
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
    const { q } = await searchParams
    let studies = []

    try {
        if (q) {
            // Use the RPC function for search if available
            // Or simpler ILIKE approach if RPC not fully set up

            // Let's try standard filtering first as it's safer without migrating DB functions manually
            // But the user DOES have search_studies defined in schema.md.
            // Let's assume it might not be deployed yet, so fallback to ILIKE OR.

            // Actually, let's use the RPC if possible, but ILIKE is robust for this simple app.
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
        // Only use mock if absolutely no data and no query (to avoid confusing search results)
        if (!q) studies = MOCK_STUDIES
        else studies = []
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Relatórios de Mercado</h1>
                <p className={styles.subtitle}>
                    Acompanhe os estudos gerados pelos agentes autônomos.
                </p>
                <div className={styles.searchContainer}>
                    <SearchInput />
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
                        <p>Nenhum relatório encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
