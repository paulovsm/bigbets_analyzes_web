import Link from 'next/link'
import styles from './page.module.css'
import { ArrowRight, BarChart3, BrainCircuit, Globe2, Layers, Search, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✨</span>
            <p>Nova Geração de Pesquisa de Mercado</p>
          </div>
          <h1 className={styles.heroTitle}>
            Identifique <span className={styles.gradientText}>Whitespaces</span> com
            <br /> Inteligência Artificial
          </h1>
          <p className={styles.heroSubtitle}>
            Nossos agentes autônomos analisam cadeias de valor inteiras, cruzam sinais de oferta e demanda
            e descobrem oportunidades de negócio ocultas em minutos.
          </p>
          <div className={styles.heroActions}>
            <Link href="/reports" className={styles.primaryCta}>
              Explorar Relatórios
              <ArrowRight size={20} />
            </Link>
            <a href="#features" className={styles.secondaryCta}>
              Como Funciona
            </a>
          </div>
        </div>
        <div className={styles.heroBackground}>
          <div className={styles.glowPrimary} />
          <div className={styles.glowSecondary} />
          <div className={styles.gridPattern} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Análise 360º de Mercado</h2>
          <p>Uma suite completa de investigação conduzida por agentes especializados.</p>
        </div>
        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={<Layers size={32} />}
            title="Cadeia de Valor"
            description="Mapeamento detalhado de todos os elos da indústria, identificando gargalos e ineficiências."
          />
          <FeatureCard
            icon={<BarChart3 size={32} />}
            title="Sinais de Demanda"
            description="Monitoramento de tendências de consumo, mudança de comportamento e necessidades não atendidas."
          />
          <FeatureCard
            icon={<Globe2 size={32} />}
            title="Sinais de Oferta"
            description="Análise da concorrência, novos entrantes, patentes e investimentos no setor."
          />
          <FeatureCard
            icon={<BrainCircuit size={32} />}
            title="Identificação de Whitespaces"
            description="Algoritmos que cruzam dados para apontar onde a oferta atual não atende a demanda futura."
          />
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process}>
        <div className={styles.sectionHeader}>
          <h2>O Poder da Agência Autônoma</h2>
          <p>Deixe os robôs fazerem o trabalho pesado de pesquisa.</p>
        </div>
        <div className={styles.processSteps}>
          <Step
            number="01"
            title="Definição do Escopo"
            description="Você define a indústria e região alvo. O Orquestrador planeja a estratégia de pesquisa."
          />
          <div className={styles.connector} />
          <Step
            number="02"
            title="Deep Research"
            description="Agentes navegam na web, leem relatórios e extraem dados estruturados sobre o mercado."
          />
          <div className={styles.connector} />
          <Step
            number="03"
            title="Síntese e Relatório"
            description="Consolidação dos insights em um dashboard interativo com as maiores oportunidades rankeadas."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Pronto para descobrir sua próxima Big Bet?</h2>
          <p>Acesse agora a biblioteca de estudos gerados.</p>
          <Link href="/reports" className={styles.primaryCta}>
            Acessar Plataforma
            <Zap size={20} fill="currentColor" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className={styles.step}>
      <span className={styles.stepNumber}>{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
