import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (error) setError(null);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#a18cd1_0%,#fbc2eb_100%)] relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_70%)] rounded-full blur-[50px] z-0 pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-[radial-gradient(circle,rgba(161,140,209,0.4)_0%,rgba(161,140,209,0)_70%)] rounded-full blur-[50px] z-0 pointer-events-none" />

            <div className="relative w-full max-w-[420px] bg-white/75 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 z-10 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-lg mb-6 text-center animate-pulse border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        label="Username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />

                    <div className="mt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-6 text-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:from-[#5a6fd6] hover:to-[#6c4396] border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-8 text-sm text-gray-500">
                    Don't have an account?{' '}
                    <span
                        className="text-[#764ba2] font-semibold cursor-pointer hover:underline hover:text-[#667eea] transition-colors"
                        onClick={() => navigate('/auth/register')}
                    >
                        Sign up
                    </span>
                </div>
            </div>
        </div>
    );
}
