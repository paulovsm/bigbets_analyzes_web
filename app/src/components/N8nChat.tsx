'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import '@n8n/chat/style.css';

export const N8nChat = () => {
    const pathname = usePathname();
    const chatInitialized = useRef(false);
    const [chatMode, setChatMode] = useState<'window' | 'fullscreen'>('window');
    const [isMounted, setIsMounted] = useState(false);

    // Load saved mode preference on mount
    useEffect(() => {
        setIsMounted(true);
        const savedMode = localStorage.getItem('n8n-chat-mode') as 'window' | 'fullscreen' | null;
        if (savedMode) {
            setChatMode(savedMode);
        }
    }, []);

    // Apply fullscreen styles manually via JavaScript
    useEffect(() => {
        if (pathname === '/' || !isMounted) return;

        const applyFullscreenStyles = () => {
            const container = document.getElementById('n8n-chat');
            if (!container) return;

            // Find the first child div created by n8n/chat
            const chatWrapper = container.firstElementChild as HTMLElement;
            if (!chatWrapper) return;

            if (chatMode === 'fullscreen') {
                // Apply fullscreen styles
                chatWrapper.style.position = 'fixed';
                chatWrapper.style.top = '0';
                chatWrapper.style.left = '0';
                chatWrapper.style.right = '0';
                chatWrapper.style.bottom = '0';
                chatWrapper.style.width = '100vw';
                chatWrapper.style.height = '100vh';
                chatWrapper.style.maxWidth = '100vw';
                chatWrapper.style.maxHeight = '100vh';
                chatWrapper.style.zIndex = '9999';
            } else {
                // Remove fullscreen styles
                chatWrapper.style.position = '';
                chatWrapper.style.top = '';
                chatWrapper.style.left = '';
                chatWrapper.style.right = '';
                chatWrapper.style.bottom = '';
                chatWrapper.style.width = '';
                chatWrapper.style.height = '';
                chatWrapper.style.maxWidth = '';
                chatWrapper.style.maxHeight = '';
                chatWrapper.style.zIndex = '';
            }
        };

        // Apply styles after a short delay to ensure chat is initialized
        const timeoutId = setTimeout(applyFullscreenStyles, 100);

        return () => clearTimeout(timeoutId);
    }, [chatMode, pathname, isMounted]);

    useEffect(() => {
        if (pathname === '/') {
            chatInitialized.current = false;
            return;
        }

        // Reset initialization flag when mode changes to force re-init
        chatInitialized.current = false;

        const initChat = async () => {
            try {
                // Clear existing chat container
                const container = document.getElementById('n8n-chat');
                if (container) {
                    container.innerHTML = '';
                }

                const { createChat } = await import('@n8n/chat');
                createChat({
                    webhookUrl: '/api/chat',
                    target: '#n8n-chat',
                    mode: chatMode,
                    showWelcomeScreen: true,
                    allowFileUploads: true,
                    allowedFilesMimeTypes: 'application/pdf',
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
    }, [pathname, chatMode]);

    const toggleMode = () => {
        const newMode = chatMode === 'window' ? 'fullscreen' : 'window';
        setChatMode(newMode);
        localStorage.setItem('n8n-chat-mode', newMode);
    };

    if (pathname === '/' || !isMounted) return null;

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
        
        .chat-mode-toggle {
          position: fixed;
          bottom: ${chatMode === 'window' ? '90px' : '20px'};
          right: ${chatMode === 'window' ? '20px' : '20px'};
          z-index: 10000;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transition: all 0.3s ease;
          font-size: 20px;
        }
        
        .chat-mode-toggle:hover {
          background: #1d4ed8;
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }
        
        .chat-mode-toggle:active {
          transform: scale(0.95);
        }
      `}</style>
            <div id="n8n-chat" key={chatMode} />
            <button
                className="chat-mode-toggle"
                onClick={toggleMode}
                title={chatMode === 'window' ? 'Expandir para tela cheia' : 'Voltar ao modo janela'}
                aria-label={chatMode === 'window' ? 'Expandir chat' : 'Minimizar chat'}
            >
                {chatMode === 'window' ? '⛶' : '⊡'}
            </button>
        </>
    );
};
