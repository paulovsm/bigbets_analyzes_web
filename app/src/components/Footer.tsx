import styles from './Footer.module.css'

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>© {new Date().getFullYear()} BigBets. Todos os direitos reservados.</p>
                <p className={styles.credit}>
                    Powered by Generative AI Agents
                </p>
            </div>
        </footer>
    )
}
