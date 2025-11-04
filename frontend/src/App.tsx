import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { ChatPage } from './components/chat/ChatPage';

const AppContent: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <LoginForm />;
    }

    return (
        <Layout>
            <ChatPage />
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AuthInitializer>
                <AppContent />
            </AuthInitializer>
        </AuthProvider>
    );
};

export default App;