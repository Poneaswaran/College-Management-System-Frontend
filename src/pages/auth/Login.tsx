import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks';
import { useTheme } from '../../theme';
import { User, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import loginBg from '../../assets/login_bg.png';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = await login(formData);

            if (user?.role?.code === 'STUDENT') {
                navigate('/student/dashboard');
            } else if (user?.role?.code === 'FACULTY') {
                navigate('/faculty/dashboard');
            } else if (user?.role?.code === 'HOD') {
                navigate('/hod/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (err as Error).message || 'Failed to login. Please check your credentials.'
                : 'Failed to login. Please check your credentials.';
            setError(errorMessage);
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
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${loginBg})` }}
            />
            
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Decorative gradient overlays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Cyan gradient blob top-right */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
                
                {/* Pink gradient blob bottom-left */}
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-200" />
            </div>

            {/* Header with Logo */}
            <header className="relative z-10 p-6 md:p-8">
                <div className="flex items-center gap-3 animate-slide-in-left">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {theme.university.name.split(' ')[0]}
                        </h1>
                        <p className="text-xs font-mono text-cyan-300 tracking-wider" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>EDUCATION</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 md:px-6 pb-20 relative z-10">
                <div className="w-full max-w-md">
                    {/* Title Section */}
                    <div className="mb-8 text-center md:text-left animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tight" style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.9)' }}>
                            Welcome<br />Back
                        </h2>
                        <p className="text-lg text-white" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
                            Sign in to access your dashboard
                        </p>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl animate-scale-in delay-100">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-in-left">
                                <p className="text-sm font-semibold text-red-800">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                                    Student / Staff ID
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Enter your ID"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full h-14 px-4 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full h-14 px-4 pl-12 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-sm font-bold text-cyan-600 hover:text-pink-600 transition-colors uppercase tracking-wide"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-black text-base uppercase tracking-wide rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Contact Admin */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Need an account?{' '}
                                <a href="#" className="font-bold text-cyan-600 hover:text-pink-600 transition-colors">
                                    Contact Admin
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats / Features */}
                    <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up delay-200">
                        <div className="text-center">
                            <div className="text-2xl font-black text-cyan-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>10K+</div>
                            <div className="text-xs font-mono text-white uppercase" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-pink-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>500+</div>
                            <div className="text-xs font-mono text-white uppercase" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Faculty</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-amber-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>50+</div>
                            <div className="text-xs font-mono text-white uppercase" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Programs</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center">
                <p className="text-sm font-mono text-white" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                    © {new Date().getFullYear()} {theme.university.name}
                </p>
            </footer>
        </div>
    );
}
