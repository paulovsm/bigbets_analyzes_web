'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MarkdownRenderer.module.css'
import { useState, useEffect } from 'react'

export function MarkdownRenderer({ content }: { content: string }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div className={styles.markdown}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ node, ...props }) => (
                        <>
                            <div className={styles.tableWrapper}>
                                <table {...props} />
                            </div>
                            {isMobile && (
                                <div className={styles.tableHint}>
                                    ← Arraste para ver mais →
                                </div>
                            )}
                        </>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
