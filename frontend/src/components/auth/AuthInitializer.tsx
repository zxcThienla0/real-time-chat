import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
                <span className="ml-2">Загрузка...</span>
            </div>
        );
    }

    return <>{children}</>;
};