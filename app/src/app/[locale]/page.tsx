import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { ArrowRight, BarChart3, BrainCircuit, Globe2, Layers, Search, Zap } from 'lucide-react'

export default function Home() {
  const t = useTranslations('Index')

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✨</span>
            <p>{t('badge')}</p>
          </div>
          <h1 className={styles.heroTitle}>
            {t('title_part1')}<span className={styles.gradientText}>{t('title_highlight')}</span>
            <br /> {t('title_part2')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>
          <div className={styles.heroActions}>
            <Link href="/reports" className={styles.primaryCta}>
              {t('cta_primary')}
              <ArrowRight size={20} />
            </Link>
            <a href="#features" className={styles.secondaryCta}>
              {t('cta_secondary')}
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
          <h2>{t('features_title')}</h2>
          <p>{t('features_subtitle')}</p>
        </div>
        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={<Layers size={32} />}
            title={t('feat_value_chain_title')}
            description={t('feat_value_chain_desc')}
          />
          <FeatureCard
            icon={<BarChart3 size={32} />}
            title={t('feat_demand_title')}
            description={t('feat_demand_desc')}
          />
          <FeatureCard
            icon={<Globe2 size={32} />}
            title={t('feat_supply_title')}
            description={t('feat_supply_desc')}
          />
          <FeatureCard
            icon={<BrainCircuit size={32} />}
            title={t('feat_whitespace_title')}
            description={t('feat_whitespace_desc')}
          />
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process}>
        <div className={styles.sectionHeader}>
          <h2>{t('process_title')}</h2>
          <p>{t('process_subtitle')}</p>
        </div>
        <div className={styles.processSteps}>
          <Step
            number="01"
            title={t('step1_title')}
            description={t('step1_desc')}
          />
          <div className={styles.connector} />
          <Step
            number="02"
            title={t('step2_title')}
            description={t('step2_desc')}
          />
          <div className={styles.connector} />
          <Step
            number="03"
            title={t('step3_title')}
            description={t('step3_desc')}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>{t('cta_bottom_title')}</h2>
          <p>{t('cta_bottom_subtitle')}</p>
          <Link href="/reports" className={styles.primaryCta}>
            {t('cta_bottom_btn')}
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
