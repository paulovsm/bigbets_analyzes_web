'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarkdownRenderer } from './MarkdownRenderer'
import { LayoutDashboard, TrendingUp, ShoppingCart, Users, Lightbulb, ChevronRight, FileText, ArrowLeft, Target, AlertTriangle, TrendingDown, PieChart, BarChart, ArrowUpRight, Info, CheckCircle, XCircle } from 'lucide-react'
import styles from './ReportView.module.css'
import { cn } from '@/lib/utils'

interface ReportViewProps {
    study: any
    reports: any[]
    whitespaces: any[]
}

// Configuration of Report Categories and their specific Keys
const REPORT_STRUCTURE = {
    value_chain: {
        id: 'value_chain',
        label: 'Cadeia de Valor',
        icon: TrendingUp,
        keys: [
            '1.1.industry_key_players',
            '1.2.industry_research',
            '1.3.value_chain_analysis',
            '1.4.value_chain_final_report'
        ]
    },
    supply: {
        id: 'supply',
        label: 'Sinais de Oferta',
        icon: ShoppingCart,
        keys: [
            '2.1.market_players_analysis',
            '2.2.porter_six_forces',
            '2.3.strategic_priorities',
            '2.4.global_vs_local',
            '2.5.current_opportunities',
            '2.6.ma_movements',
            '2.7.vc_investments',
            '2.8.new_entrants',
            '2.9.follow_the_money',
            '2.10.future_trends',
            '2.11.regulatory_changes',
            '2.12.emerging_tech',
            '2.13.startups',
            '2.14.key_trends',
            '2.15.opportunities',
            '2.16.ongoing_changes'
        ]
    },
    demand: {
        id: 'demand',
        label: 'Sinais de Demanda',
        icon: Users,
        keys: [
            '3.1.customers_identification',
            '3.2.demand_behavior',
            '3.3.challenges_pains',
            '3.4.social_listening',
            '3.5.current_pains',
            '3.6.behavior_changes',
            '3.7.emerging_needs',
            '3.8.consumption_trends'
        ]
    },
    whitespaces: {
        id: 'whitespaces',
        label: 'Oportunidades',
        icon: Lightbulb,
        keys: [
            '4.1.niche_markets',
            '4.2.qualified_whitespaces',
            '4.3.addressable_market',
            '4.4.complete_report'
        ]
    }
}

export function ReportView({ study, reports, whitespaces }: ReportViewProps) {
    const [activeTab, setActiveTab] = useState('overview')
    // State to track selected sub-report for each main category
    const [subSelection, setSubSelection] = useState<Record<string, string>>({})
    // State for dedicated whitespace detail view
    const [selectedWhitespace, setSelectedWhitespace] = useState<any>(null)
    // State to track if we're on mobile
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Helper to safely parse JSON lists that might be double-encoded or just strings
    const parseList = (data: any): string[] => {
        if (!data) return []
        if (Array.isArray(data)) return data
        try {
            const parsed = JSON.parse(data)
            if (typeof parsed === 'string') {
                try {
                    const doubleParsed = JSON.parse(parsed)
                    return Array.isArray(doubleParsed) ? doubleParsed : [parsed]
                } catch {
                    return [parsed]
                }
            }
            return Array.isArray(parsed) ? parsed : [parsed]
        } catch (e) {
            return [String(data)]
        }
    }

    // Helper to properly format the calculation assumptions object
    const renderAssumptions = (data: any) => {
        if (!data) return <p className={styles.detailText}>Nenhuma premissa especificada.</p>

        let parsedData = data
        if (typeof data === 'string') {
            try {
                parsedData = JSON.parse(data)
                // Handle double stringification
                if (typeof parsedData === 'string') {
                    parsedData = JSON.parse(parsedData)
                }
            } catch (e) {
                return <p className={styles.detailText}>{String(data)}</p>
            }
        }

        // Check if there is a root key "premissas_calculo"
        if (parsedData && typeof parsedData === 'object' && parsedData.premissas_calculo) {
            parsedData = parsedData.premissas_calculo
        }

        if (!parsedData || typeof parsedData !== 'object' || Object.keys(parsedData).length === 0) {
            return <p className={styles.detailText}>Nenhuma premissa de cálculo detalhada disponível.</p>
        }

        return (
            <ul className={styles.dashboardList}>
                {Object.entries(parsedData).map(([key, value], i) => (
                    <li key={i}>
                        <strong>{key}:</strong> {String(value)}
                    </li>
                ))}
            </ul>
        )
    }

    // Helper to format currency
    const formatMoney = (val: any) => {
        if (!val) return 'N/A'

        const num = Number(val)
        if (isNaN(num)) return val

        if (num >= 1000000000) {
            return `R$ ${(num / 1000000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} Bilhões`
        }
        if (num >= 1000000) {
            return `R$ ${(num / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} Milhões`
        }

        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
    }

    // Helper to format keys like '1.1.industry_key_players' -> '1.1 Industry Key Players'
    const formatLabel = (key: string) => {
        return key
            .split('.')
            .map((part, i) => i === 0 || i === 1 ? part : part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
            .replace(/_/g, ' ')
    }

    // Group available reports by category
    const categoryContent = useMemo(() => {
        const grouped: Record<string, any[]> = {}

        Object.entries(REPORT_STRUCTURE).forEach(([catId, config]) => {
            // Find all reports that match the keys for this category
            const catReports = config.keys.map(key => {
                const found = reports.find(r => r.report_key === key || r.report_key?.includes(key))
                return found ? { ...found, label: formatLabel(key), key } : null
            }).filter(Boolean)

            grouped[catId] = catReports
        })

        return grouped
    }, [reports])

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
        // If switching to a category and no sub-selection exists, select the first available report
        if (categoryContent[tabId]?.length > 0 && !subSelection[tabId]) {
            setSubSelection(prev => ({
                ...prev,
                [tabId]: categoryContent[tabId][0].key
            }))
        }
    }

    return (
        <div className={styles.container}>
            {/* Sidebar Navigation */}
            <div className={styles.sidebar}>
                <div className={styles.studyInfo}>
                    <h2>{study.target_industry}</h2>
                    <p>{study.target_region}</p>
                </div>
                {isMobile ? (
                    /* Mobile Dropdown Navigation */
                    <div className={styles.mobileNavContainer}>
                        <label htmlFor="section-select" className={styles.mobileNavLabel}>Seção:</label>
                        <select
                            id="section-select"
                            value={activeTab}
                            onChange={(e) => handleTabChange(e.target.value)}
                            className={styles.mobileSelect}
                        >
                            <option value="overview">Visão Geral</option>
                            {Object.entries(REPORT_STRUCTURE).map(([catId, config]) => {
                                const availableCount = categoryContent[catId]?.length || 0
                                return (
                                    <option key={catId} value={catId}>
                                        {config.label} {availableCount > 0 ? `(${availableCount})` : ''}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                ) : (
                    /* Desktop Navigation */
                    <nav className={styles.nav}>
                        <button
                            onClick={() => handleTabChange('overview')}
                            className={cn(styles.navItem, activeTab === 'overview' && styles.active)}
                        >
                            <LayoutDashboard size={18} />
                            Visão Geral
                        </button>

                        {Object.entries(REPORT_STRUCTURE).map(([catId, config]) => {
                            const Icon = config.icon
                            const availableCount = categoryContent[catId]?.length || 0

                            return (
                                <button
                                    key={catId}
                                    onClick={() => handleTabChange(catId)}
                                    className={cn(styles.navItem, activeTab === catId && styles.active)}
                                >
                                    <Icon size={18} />
                                    <span className={styles.navLabel}>{config.label}</span>
                                    {availableCount > 0 && <span className={styles.badge}>{availableCount}</span>}
                                </button>
                            )
                        })}
                    </nav>
                )}
            </div>

            {/* Main Content Area */}
            <main className={styles.content}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={styles.motionWrapper}
                    >
                        {/* WHITESPACE DETAIL VIEW OVERLAY - DASHBOARD STYLE */}
                        {selectedWhitespace ? (
                            <div className={styles.dashboardContainer}>
                                {/* 1. Sticky Hero Header */}
                                <div className={styles.dashboardHeader}>
                                    <div className={styles.headerTopRow}>
                                        <button
                                            className={styles.backButton}
                                            onClick={() => setSelectedWhitespace(null)}
                                        >
                                            <ArrowLeft size={16} />
                                            Voltar ao Relatório
                                        </button>
                                        <div className={styles.headerBadges}>
                                            <div className={styles.statusBadge}>
                                                <Target size={14} />
                                                <span>Sinal: {selectedWhitespace.signal_strength_rank}/10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className={styles.headerTitle}>{selectedWhitespace.name}</h1>
                                </div>

                                {/* 2. Key Metrics Row */}
                                <div className={styles.metricsRow}>
                                    <div className={styles.metricCard}>
                                        <span className={styles.metricLabel}>TAM (Total Addressable Market) <PieChart size={16} /></span>
                                        <span className={`${styles.metricValue} ${styles.highlight}`}>{formatMoney(selectedWhitespace.tam_mid)}</span>
                                        <span className={styles.metricSub}>Cenário Base (Mid)</span>
                                    </div>
                                    <div className={styles.metricCard}>
                                        <span className={styles.metricLabel}>SAM (Serviceable Market) <BarChart size={16} /></span>
                                        <span className={styles.metricValue}>{formatMoney(selectedWhitespace.sam_mid)}</span>
                                        <span className={styles.metricSub}>Cenário Base (Mid)</span>
                                    </div>
                                    <div className={styles.metricCard}>
                                        <span className={styles.metricLabel}>Captura Estimada <ArrowUpRight size={16} /></span>
                                        {/* Example calculation or just ratio */}
                                        <span className={styles.metricValue}>
                                            {selectedWhitespace.tam_mid && selectedWhitespace.sam_mid
                                                ? `${Math.round((selectedWhitespace.sam_mid / selectedWhitespace.tam_mid) * 100)}%`
                                                : '-'}
                                        </span>
                                        <span className={styles.metricSub}>% do TAM Acessível (SAM/TAM)</span>
                                    </div>
                                </div>

                                {/* 3. Bento Grid - Context & Lists */}
                                <div className={styles.bentoGrid}>
                                    {/* Left Column: Context & Market Analysis */}
                                    <div className={styles.listsContainer}>
                                        <div className={styles.dashboardCard}>
                                            <div className={styles.cardHeader}>
                                                <Info className={styles.cardIcon} size={20} />
                                                Descrição da Oportunidade
                                            </div>
                                            <p className={styles.descriptionText}>{selectedWhitespace.description}</p>
                                        </div>

                                        <div className={styles.dashboardCard}>
                                            <div className={styles.cardHeader}>
                                                <TrendingUp className={styles.cardIcon} size={20} />
                                                Análise de Mercado (TAM & SAM)
                                            </div>
                                            <table className={styles.marketTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Cenário</th>
                                                        <th>TAM (Total)</th>
                                                        <th>SAM (Endereçável)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Conservador (Low)</td>
                                                        <td>{formatMoney(selectedWhitespace.tam_low)}</td>
                                                        <td>{formatMoney(selectedWhitespace.sam_low)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className={styles.marketHighlight}>Base (Mid)</td>
                                                        <td className={styles.marketHighlight}>{formatMoney(selectedWhitespace.tam_mid)}</td>
                                                        <td className={styles.marketHighlight}>{formatMoney(selectedWhitespace.sam_mid)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Otimista (High)</td>
                                                        <td>{formatMoney(selectedWhitespace.tam_high)}</td>
                                                        <td>{formatMoney(selectedWhitespace.sam_high)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className={`${styles.dashboardCard}`} >
                                            <div className={styles.cardHeader}>
                                                <FileText className={styles.cardIcon} size={20} />
                                                Metodologia e Premissas
                                            </div>
                                            <div className={styles.assumptionsContainer}>
                                                <h4 style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Metodologia</h4>
                                                <p className={styles.descriptionText} style={{ marginBottom: '1.5rem' }}>{selectedWhitespace.calculation_methodology || 'Não especificada.'}</p>

                                                {selectedWhitespace.key_assumptions && parseList(selectedWhitespace.key_assumptions).length > 0 && (
                                                    <>
                                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Premissas Chave</h4>
                                                        <ul className={styles.dashboardList} style={{ marginBottom: '1.5rem' }}>
                                                            {parseList(selectedWhitespace.key_assumptions).map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                <h4 style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Premissas de Cálculo (Detalhes)</h4>
                                                {renderAssumptions(selectedWhitespace.calculation_assumptions)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Signals & Risks */}
                                    <div className={styles.listsContainer}>
                                        <div className={styles.dashboardCard}>
                                            <div className={styles.cardHeader}>
                                                <Users className={styles.cardIcon} size={20} />
                                                Sinais de Demanda
                                            </div>
                                            <ul className={styles.dashboardList}>
                                                {parseList(selectedWhitespace.demand_signals).map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className={styles.dashboardCard}>
                                            <div className={styles.cardHeader}>
                                                <ShoppingCart className={styles.cardIcon} size={20} />
                                                Sinais de Oferta / Lacunas
                                            </div>
                                            <ul className={styles.dashboardList}>
                                                {parseList(selectedWhitespace.supply_signals).map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className={styles.dashboardCard} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                            <div className={styles.cardHeader} style={{ color: '#ef4444' }}>
                                                <AlertTriangle size={20} />
                                                Riscos Associados
                                            </div>
                                            <ul className={styles.dashboardList}>
                                                {parseList(selectedWhitespace.risks).map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {selectedWhitespace.affected_value_chain_steps && (
                                            <div className={styles.dashboardCard}>
                                                <div className={styles.cardHeader}>
                                                    <TrendingDown className={styles.cardIcon} size={20} />
                                                    Cadeia de Valor Afetada
                                                </div>
                                                <ul className={styles.dashboardList}>
                                                    {parseList(selectedWhitespace.affected_value_chain_steps).map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'overview' && (
                                    <div className={styles.section}>
                                        <h1>Visão Geral do Estudo</h1>
                                        <div className={styles.statsGrid}>
                                            <div className={styles.statCard}>
                                                <h3>Status</h3>
                                                <p>{study.status}</p>
                                            </div>
                                            <div className={styles.statCard}>
                                                <h3>Total de Relatórios</h3>
                                                <p>{reports.length}</p>
                                            </div>
                                            <div className={styles.statCard}>
                                                <h3>Whitespaces</h3>
                                                <p>{whitespaces.length}</p>
                                            </div>
                                        </div>

                                        {whitespaces.length > 0 && (
                                            <div className={styles.whitespacesSection}>
                                                <h2>Oportunidades Identificadas</h2>
                                                <div className={styles.whitespacesGrid}>
                                                    {whitespaces.map((ws: any) => (
                                                        <div
                                                            key={ws.id}
                                                            className={styles.whitespaceCard}
                                                            onClick={() => setSelectedWhitespace(ws)}
                                                            role="button"
                                                        >
                                                            <div className={styles.wsHeader}>
                                                                <h3>{ws.name}</h3>
                                                                <span className={styles.rank}>Força do Sinal: {ws.signal_strength_rank}/10</span>
                                                            </div>
                                                            <p className={styles.wsDesc}>{ws.description}</p>

                                                            {/* Preview Details */}
                                                            <div className={styles.wsDetails}>
                                                                {ws.demand_signals && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Sinais de Demanda (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.demand_signals).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {ws.supply_signals && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Sinais de Oferta (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.supply_signals).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {ws.risks && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Riscos (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.risks).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {ws.tam_mid && (
                                                                <div className={styles.tamBox}>
                                                                    <strong>TAM (Base):</strong> {formatMoney(ws.tam_mid)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ANALYSIS TABS (Value Chain, Supply, Demand, Whitespace Reports) */}
                                {['value_chain', 'supply', 'demand', 'whitespaces'].includes(activeTab) && (
                                    <div className={styles.section}>
                                        <div className={styles.sectionHeader}>
                                            <h1>{REPORT_STRUCTURE[activeTab as keyof typeof REPORT_STRUCTURE].label}</h1>
                                        </div>

                                        {/* Sub-Navigation (Pills) */}
                                        {categoryContent[activeTab]?.length > 0 ? (
                                            <div className={styles.reportContainer}>
                                                <div className={styles.subSidebar}>
                                                    <h3>Capítulos</h3>
                                                    {isMobile ? (
                                                        /* Mobile Dropdown for Chapters */
                                                        <select
                                                            value={subSelection[activeTab] || ''}
                                                            onChange={(e) => setSubSelection(prev => ({ ...prev, [activeTab]: e.target.value }))}
                                                            className={styles.mobileSelect}
                                                        >
                                                            <option value="">Selecione um capítulo</option>
                                                            {categoryContent[activeTab].map((report: any) => (
                                                                <option key={report.key} value={report.key}>
                                                                    {report.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        /* Desktop Pills Navigation */
                                                        <div className={styles.subList}>
                                                            {categoryContent[activeTab].map((report: any) => (
                                                                <button
                                                                    key={report.key}
                                                                    onClick={() => setSubSelection(prev => ({ ...prev, [activeTab]: report.key }))}
                                                                    className={cn(
                                                                        styles.subItem,
                                                                        subSelection[activeTab] === report.key && styles.subItemActive
                                                                    )}
                                                                >
                                                                    <span className={styles.dot}></span>
                                                                    {report.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.reportContent}>
                                                    {subSelection[activeTab] ? (
                                                        <div className={styles.markdownWrapper}>
                                                            <h2 className={styles.chapterTitle}>{categoryContent[activeTab].find(r => r.key === subSelection[activeTab])?.label}</h2>
                                                            <MarkdownRenderer
                                                                content={categoryContent[activeTab].find(r => r.key === subSelection[activeTab])?.content || ''}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className={styles.placeholderText}>Selecione um capítulo para ler.</p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <FileText size={48} />
                                                <p>Nenhum relatório gerado para esta seção ainda.</p>
                                            </div>
                                        )}

                                        {/* Special Case: Show Whitespace Cards below reports if in Whitespaces tab */}
                                        {activeTab === 'whitespaces' && whitespaces.length > 0 && (
                                            <div className={styles.whitespacesSection}>
                                                <h2>Oportunidades Identificadas</h2>
                                                <div className={styles.whitespacesGrid}>
                                                    {whitespaces.map((ws: any) => (
                                                        <div
                                                            key={ws.id}
                                                            className={styles.whitespaceCard}
                                                            onClick={() => setSelectedWhitespace(ws)}
                                                            role="button"
                                                        >
                                                            <div className={styles.wsHeader}>
                                                                <h3>{ws.name}</h3>
                                                                <span className={styles.rank}>Força do Sinal: {ws.signal_strength_rank}/10</span>
                                                            </div>
                                                            <p className={styles.wsDesc}>{ws.description}</p>

                                                            <div className={styles.wsDetails}>
                                                                {ws.demand_signals && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Sinais de Demanda (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.demand_signals).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {ws.supply_signals && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Sinais de Oferta (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.supply_signals).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {ws.risks && (
                                                                    <div className={styles.detailBlock}>
                                                                        <h4>Riscos (Preview)</h4>
                                                                        <ul>
                                                                            {parseList(ws.risks).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {ws.tam_mid && (
                                                                <div className={styles.tamBox}>
                                                                    <strong>TAM (Base):</strong> {formatMoney(ws.tam_mid)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div >
    )
}
