import { supabase } from '@/lib/supabase'
import { ReportView } from '@/components/ReportView'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

// Mock data generator for fallback
function getMockData(id: string) {
    return {
        study: {
            id,
            target_industry: 'Exemplo: Inteligência Artificial',
            target_region: 'Brasil',
            status: 'completed',
            study_language: 'pt-BR'
        },
        reports: [
            {
                report_type: 'value_chain_analysis',
                content: '# Cadeia de Valor\n\nEste é um exemplo de conteúdo markdown...'
            }
        ],
        whitespaces: [
            {
                id: 'ws1',
                name: 'Oportunidade Exemplo 1',
                description: 'Descrição detalhada da oportunidade identificada.',
                signal_strength_rank: 1,
                tam_mid: 500000000
            }
        ]
    }
}

export default async function StudyPage({ params }: PageProps) {
    const { id } = await params

    let study, reports, whitespaces

    try {
        const studyRes = await supabase
            .from('whitespace_studies')
            .select('*')
            .eq('id', id)
            .single()

        if (studyRes.error) {
            // If basic fetch fails, maybe RLS or connection issue. 
            // For demo purposes, check if ID is 'mock' or fall back
            console.error('Supabase error:', studyRes.error)
            throw studyRes.error
        }

        study = studyRes.data

        const reportsRes = await supabase
            .from('study_reports')
            .select('*')
            .eq('study_id', id)
            .order('version', { ascending: false })

        reports = reportsRes.data || []

        const wsRes = await supabase
            .from('whitespaces')
            .select('*')
            .eq('study_id', id)
            .order('signal_strength_rank', { ascending: true })

        whitespaces = wsRes.data || []

    } catch (error) {
        // Fallback to mock data if ID is not found or connection fails (for demo feeling)
        // In production, you'd handle this better.
        console.log('Falling back to mock/empty data due to error')
        // If we want to strictly fail:
        // notFound()

        // For now, let's verify if we really want to render the page
        // If not found in DB, return 404
        if (!study) {
            // Just for user experience in this "demo" creation, let's provide mock if ID=1
            if (id === '1') {
                const mock = getMockData(id)
                study = mock.study
                reports = mock.reports
                whitespaces = mock.whitespaces
            } else {
                // content not found
                notFound()
            }
        }
    }

    return (
        <ReportView
            study={study}
            reports={reports || []}
            whitespaces={whitespaces || []}
        />
    )
}
