import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { N8nChat } from '@/components/N8nChat'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BigBets Whitespace Reports',
  description: 'Visualizador de estudos de mercado e oportunidades.',
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <N8nChat />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
