'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import '@n8n/chat/style.css';

export const N8nChat = () => {
    const pathname = usePathname();
    const chatInitialized = useRef(false);

    useEffect(() => {
        if (pathname === '/') {
            chatInitialized.current = false;
            return;
        }

        // Prevent double initialization in strict mode or re-renders
        if (chatInitialized.current) {
            // If the container is empty (e.g. re-mounted), we might need to re-init
            const container = document.getElementById('n8n-chat');
            if (container && container.childElementCount === 0) {
                // continue to init
            } else {
                return;
            }
        }

        const initChat = async () => {
            try {
                const { createChat } = await import('@n8n/chat');
                createChat({
                    webhookUrl: '/api/chat',
                    target: '#n8n-chat',
                    mode: 'window',
                    showWelcomeScreen: true,
                    initialMessages: [
                        'Olá! 👋',
                        'Sou a inteligência artificial da BigBets. Como posso ajudar você a explorar os relatórios de mercado hoje?',
                    ],
                    i18n: {
                        en: {
                            title: 'Assistente BigBets',
                            subtitle: 'Pergunte sobre os estudos.',
                            footer: '',
                            getStarted: 'Nova Conversa',
                            inputPlaceholder: 'Digite sua mensagem...',
                            closeButtonTooltip: 'Fechar chat',
                        },
                    },
                });
                chatInitialized.current = true;
            } catch (error) {
                console.error('Failed to load chat widget:', error);
            }
        };

        initChat();
    }, [pathname]);

    if (pathname === '/') return null;

    return (
        <>
            <style jsx global>{`
        :root {
          --chat--color--primary: #2563eb;
          --chat--color--primary-shade-50: #1d4ed8;
          --chat--color--primary--shade-100: #1e40af;
          --chat--color--secondary: #0f172a; /* matches foreground */
          --chat--color--secondary-shade-50: #1e293b;
          
          --chat--window--width: 380px;
          --chat--header--background: #0f172a;
          --chat--header--color: #ffffff;
          
          /* Tweaking position if needed, but default is usually bottom-right fixed */
          --chat--toggle--background: #2563eb;
          --chat--toggle--hover--background: #1d4ed8;
        }
      `}</style>
            <div id="n8n-chat" />
        </>
    );
};
