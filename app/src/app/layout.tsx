import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { N8nChat } from '@/components/N8nChat'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BigBets Whitespace Reports',
  description: 'Visualizador de estudos de mercado e oportunidades.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <N8nChat />
        </ThemeProvider>
      </body>
    </html>
  )
}
