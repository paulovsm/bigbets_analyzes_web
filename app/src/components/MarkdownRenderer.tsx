'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MarkdownRenderer.module.css'

export function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    )
}
