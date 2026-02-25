import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { store } from '../store';
import { client } from '../lib/graphql';
import { ThemeProvider } from '../theme';
import { SidebarProvider } from '../contexts/SidebarContext';
import { ToastProvider } from '../components/ui/Toast';
import { KeyboardShortcutsProvider } from '../components/ui/KeyboardShortcuts';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <ToastProvider>
                        <SidebarProvider>
                            <HashRouter>
                                <KeyboardShortcutsProvider>
                                    {children}
                                </KeyboardShortcutsProvider>
                            </HashRouter>
                        </SidebarProvider>
                    </ToastProvider>
                </ApolloProvider>
            </Provider>
        </ThemeProvider>
    );
}
