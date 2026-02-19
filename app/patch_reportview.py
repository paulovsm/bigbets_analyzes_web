import re
import json

path = '/Users/paulo.victor.moura/Documents/bigbets_multi_agent_web/app/src/components/ReportView.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add useTranslations import
if 'useTranslations' not in content:
    content = content.replace("import { useState, useMemo, useEffect, useCallback } from 'react'", "import { useState, useMemo, useEffect, useCallback } from 'react'\nimport { useTranslations } from 'next-intl'")

# Add hook call
if 'const t = useTranslations' not in content:
    content = content.replace("export function ReportView({ study, reports, whitespaces }: ReportViewProps) {", "export function ReportView({ study, reports, whitespaces }: ReportViewProps) {\n    const t = useTranslations('ReportView')")

# Direct string replacements
replacements = {
    "Atualizar Dados": "{t('refresh_data')}",
    "Seção:": "{t('section_label')}",
    "Visão Geral</option>": "{t('overview')}</option>",
    "Visão Geral\n                        </button>": "{t('overview')}\n                        </button>",
    "Visão Geral do Estudo</h1>": "{t('overview_title')}</h1>",
    "Status</h3>": "{t('status')}</h3>",
    "Total de Relatórios</h3>": "{t('total_reports')}</h3>",
    "Whitespaces</h3>": "{t('whitespaces')}</h3>",
    "Oportunidades Identificadas</h2>": "{t('identified_opportunities')}</h2>",
    "Força do Sinal:": "{t('signal_strength')}",
    "Sinais de Demanda (Preview)</h4>": "{t('demand_preview')}</h4>",
    "Sinais de Oferta (Preview)</h4>": "{t('supply_preview')}</h4>",
    "Riscos (Preview)</h4>": "{t('risks_preview')}</h4>",
    "TAM (Base):</strong>": "{t('tam_base')}</strong>",
    "Capítulos</h3>": "{t('chapters')}</h3>",
    "Selecione um capítulo": "{t('select_chapter')}",
    "Versão:</label>": "{t('version')}</label>",
    "(Atual)": "{t('current_version')}",
    "Selecione um capítulo para ler.</p>": "{t('select_chapter_to_read')}</p>",
    "Nenhum relatório gerado para esta seção ainda.</p>": "{t('no_reports')}</p>",
    "Voltar ao Relatório": "{t('back_to_report')}",
    "Sinal: ": "{t('signal')} ",
    "Descrição da Oportunidade": "{t('opportunity_description')}",
    "Análise de Mercado (TAM &amp; SAM)": "{t('market_analysis')}",
    "Cenário</th>": "{t('scenario')}</th>",
    "TAM (Total)</th>": "{t('tam_total')}</th>",
    "SAM (Endereçável)</th>": "{t('sam_addressable')}</th>",
    "Conservador (Low)": "{t('conservative')}",
    "Base (Mid)</td>": "{t('base')}</td>",
    "Base (Mid)</span>": "{t('base')}</span>",
    "Otimista (High)": "{t('optimistic')}",
    "Metodologia e Premissas": "{t('methodology_and_assumptions')}",
    "Metodologia</h4>": "{t('methodology')}</h4>",
    "Premissas Chave</h4>": "{t('key_assumptions')}</h4>",
    "Premissas de Cálculo (Detalhes)</h4>": "{t('calculation_details')}</h4>",
    "Sinais de Demanda": "{t('demand_signals')}",
    "Sinais de Oferta / Lacunas": "{t('supply_signals')}",
    "Riscos Associados": "{t('associated_risks')}",
    "Cadeia de Valor Afetada": "{t('affected_value_chain')}"
}

for old, new in replacements.items():
    content = content.replace(old, new)

# And replace the REPORT_STRUCTURE labels:
content = content.replace("label: 'Cadeia de Valor',", "label: t('report_value_chain'),")
content = content.replace("label: 'Sinais de Oferta',", "label: t('report_supply_signals'),")
content = content.replace("label: 'Sinais de Demanda',", "label: t('report_demand_signals'),")
content = content.replace("label: 'Oportunidades',", "label: t('report_opportunities'),")

# But wait, REPORT_STRUCTURE is outside the component!
# I will move it inside the component or just use translations dynamically.
# Let's just fix REPORT_STRUCTURE by moving it into the component so it has access to `t`.
# First, remove it from outside:
# Find REPORT_STRUCTURE definition and move it inside
if "const REPORT_STRUCTURE" in content:
    idx = content.find("const REPORT_STRUCTURE = {")
    end_idx = content.find("}\n\nexport function ReportView")
    if idx != -1 and end_idx != -1:
        struct_block = content[idx:end_idx+2]
        content = content.replace(struct_block, "")
        
        # Place it inside ReportView Component after const t = useTranslations
        insert_idx = content.find("const t = useTranslations('ReportView')")
        if insert_idx != -1:
            insert_str = struct_block.replace("const REPORT_STRUCTURE", "const REPORT_STRUCTURE")
            # indent it
            indented = ["    " + line for line in insert_str.split("\n")]
            insert_str = "\n".join(indented)
            
            # replace hardcoded labels
            insert_str = insert_str.replace("label: 'Cadeia de Valor',", "label: t('report_value_chain'),")
            insert_str = insert_str.replace("label: 'Sinais de Oferta',", "label: t('report_supply_signals'),")
            insert_str = insert_str.replace("label: 'Sinais de Demanda',", "label: t('report_demand_signals'),")
            insert_str = insert_str.replace("label: 'Oportunidades',", "label: t('report_opportunities'),")
            
            content = content[:insert_idx+len("const t = useTranslations('ReportView')")] + "\n\n" + insert_str + content[insert_idx+len("const t = useTranslations('ReportView')"):]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
