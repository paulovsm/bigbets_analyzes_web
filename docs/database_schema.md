# Schema do Banco de Dados (Supabase)

## Criação das Tabelas

```sql
-- =====================================================
-- WHITESPACE STUDIES - Tabela principal de estudos
-- =====================================================
CREATE TABLE whitespace_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(100) UNIQUE NOT NULL,
    target_industry VARCHAR(255) NOT NULL,
    target_region VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    top_players INTEGER NOT NULL DEFAULT 10,
    must_have_players TEXT[] DEFAULT '{}',
    study_language VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
    
    -- Status geral e por etapa
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    value_chain_status VARCHAR(50) DEFAULT 'pending',
    supply_signals_status VARCHAR(50) DEFAULT 'pending',
    demand_signals_status VARCHAR(50) DEFAULT 'pending',
    whitespace_status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    value_chain_completed_at TIMESTAMPTZ,
    supply_signals_completed_at TIMESTAMPTZ,
    demand_signals_completed_at TIMESTAMPTZ,
    whitespace_completed_at TIMESTAMPTZ,
    
    -- User tracking
    created_by UUID REFERENCES auth.users(id),
    
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'deleted')),
    CONSTRAINT valid_language CHECK (study_language IN ('pt-BR', 'en-US', 'es-ES'))
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_studies_updated_at
    BEFORE UPDATE ON whitespace_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- STUDY REPORTS - Relatórios gerados
-- =====================================================
CREATE TABLE study_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id UUID NOT NULL REFERENCES whitespace_studies(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    report_key VARCHAR(100) NOT NULL,
    step_name VARCHAR(100),
    task_name VARCHAR(200),
    content TEXT NOT NULL,
    content_hash VARCHAR(64),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(study_id, report_key, version)
);

CREATE TRIGGER trigger_reports_updated_at
    BEFORE UPDATE ON study_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- WHITESPACES - Oportunidades identificadas
-- =====================================================
CREATE TABLE whitespaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id UUID NOT NULL REFERENCES whitespace_studies(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Qualificação
    demand_signals JSONB DEFAULT '[]',
    supply_signals JSONB DEFAULT '[]',
    affected_value_chain_steps JSONB DEFAULT '[]',
    signal_strength_rank INTEGER CHECK (signal_strength_rank BETWEEN 1 AND 10),
    key_assumptions JSONB DEFAULT '[]',
    risks JSONB DEFAULT '[]',
    
    -- Quantificação (TAM)
    tam_low DECIMAL(20,2),
    tam_mid DECIMAL(20,2),
    tam_high DECIMAL(20,2),
    sam_low DECIMAL(20,2),
    sam_mid DECIMAL(20,2),
    sam_high DECIMAL(20,2),
    calculation_methodology TEXT,
    calculation_assumptions JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_whitespaces_updated_at
    BEFORE UPDATE ON whitespaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- CLIENT ANALYSES - Análises específicas por cliente
-- =====================================================
CREATE TABLE client_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id UUID NOT NULL REFERENCES whitespace_studies(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_context TEXT,
    client_document_url VARCHAR(500),
    
    growth_opportunities JSONB DEFAULT '[]',
    strategic_recommendations JSONB DEFAULT '[]',
    report_content TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STUDY CONVERSATIONS - Histórico de conversas
-- =====================================================
CREATE TABLE study_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id UUID REFERENCES whitespace_studies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    message_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_message_type CHECK (message_type IN ('user', 'assistant', 'system'))
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_studies_status ON whitespace_studies(status);
CREATE INDEX idx_studies_industry ON whitespace_studies(target_industry);
CREATE INDEX idx_studies_region ON whitespace_studies(target_region);
CREATE INDEX idx_studies_created ON whitespace_studies(created_at DESC);

CREATE INDEX idx_reports_study ON study_reports(study_id);
CREATE INDEX idx_reports_type ON study_reports(report_type);
CREATE INDEX idx_reports_key ON study_reports(report_key);

CREATE INDEX idx_whitespaces_study ON whitespaces(study_id);
CREATE INDEX idx_whitespaces_rank ON whitespaces(signal_strength_rank DESC);

CREATE INDEX idx_conversations_study ON study_conversations(study_id);
CREATE INDEX idx_conversations_created ON study_conversations(created_at);

-- =====================================================
-- FULL TEXT SEARCH (Busca Híbrida)
-- =====================================================

-- Extension para trigram similarity
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- FTS para relatórios (português)
ALTER TABLE study_reports 
ADD COLUMN content_fts tsvector 
GENERATED ALWAYS AS (to_tsvector('portuguese', content)) STORED;

CREATE INDEX idx_reports_content_fts ON study_reports USING GIN(content_fts);

-- FTS para whitespaces
ALTER TABLE whitespaces
ADD COLUMN searchable_fts tsvector
GENERATED ALWAYS AS (to_tsvector('portuguese', name || ' ' || COALESCE(description, ''))) STORED;

CREATE INDEX idx_whitespaces_fts ON whitespaces USING GIN(searchable_fts);

-- =====================================================
-- RPC FUNCTIONS PARA BUSCA
-- =====================================================

-- Busca em relatórios por termo
CREATE OR REPLACE FUNCTION search_reports(
    p_study_id UUID,
    p_query TEXT
)
RETURNS TABLE (
    id UUID,
    report_key VARCHAR,
    task_name VARCHAR,
    content TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.report_key,
        r.task_name,
        r.content,
        ts_rank(r.content_fts, plainto_tsquery('portuguese', p_query)) as rank
    FROM study_reports r
    WHERE r.study_id = p_study_id
      AND r.content_fts @@ plainto_tsquery('portuguese', p_query)
    ORDER BY rank DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Busca em whitespaces
CREATE OR REPLACE FUNCTION search_whitespaces(
    p_study_id UUID DEFAULT NULL,
    p_query TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    study_id UUID,
    name VARCHAR,
    description TEXT,
    tam_mid DECIMAL,
    signal_strength_rank INTEGER,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.study_id,
        w.name,
        w.description,
        w.tam_mid,
        w.signal_strength_rank,
        COALESCE(ts_rank(w.searchable_fts, plainto_tsquery('portuguese', p_query)), 1.0) as rank
    FROM whitespaces w
    WHERE (p_study_id IS NULL OR w.study_id = p_study_id)
      AND (p_query IS NULL OR w.searchable_fts @@ plainto_tsquery('portuguese', p_query))
    ORDER BY rank DESC, w.signal_strength_rank DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Buscar estudos por termo
CREATE OR REPLACE FUNCTION search_studies(p_query TEXT)
RETURNS TABLE (
    id UUID,
    job_id VARCHAR,
    target_industry VARCHAR,
    target_region VARCHAR,
    status VARCHAR,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.job_id,
        s.target_industry,
        s.target_region,
        s.status,
        s.created_at
    FROM whitespace_studies s
    WHERE s.status != 'deleted'
      AND (
        s.target_industry ILIKE '%' || p_query || '%'
        OR s.target_region ILIKE '%' || p_query || '%'
        OR s.job_id ILIKE '%' || p_query || '%'
      )
    ORDER BY s.created_at DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE whitespace_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitespaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_conversations ENABLE ROW LEVEL SECURITY;

-- Policies (ajuste conforme necessidade)
CREATE POLICY "Users can view own studies" ON whitespace_studies
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own studies" ON whitespace_studies
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own studies" ON whitespace_studies
    FOR UPDATE USING (auth.uid() = created_by);
```

## Uso pelos Agentes

### Criar novo estudo
```sql
INSERT INTO whitespace_studies (target_industry, target_region, top_players, must_have_players, study_language, created_by)
VALUES ($1, $2, $3, $4, $5, auth.uid())
RETURNING id, job_id;
```

### Salvar relatório
```sql
INSERT INTO study_reports (study_id, report_type, report_key, step_name, task_name, content, content_hash)
VALUES ($1, $2, $3, $4, $5, $6, encode(sha256($6::bytea), 'hex'))
ON CONFLICT (study_id, report_key, version) 
DO UPDATE SET content = EXCLUDED.content, content_hash = EXCLUDED.content_hash, updated_at = NOW();
```

### Atualizar status
```sql
UPDATE whitespace_studies 
SET value_chain_status = 'completed', value_chain_completed_at = NOW()
WHERE id = $1;
```

### Buscar relatório
```sql
SELECT content FROM study_reports 
WHERE study_id = $1 AND report_key = $2
ORDER BY version DESC LIMIT 1;
```
