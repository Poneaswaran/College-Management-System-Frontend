import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks';
import { useTheme } from '../../theme';
import loginBg from '../../assets/login_bg.png';

// SVG Icon Components
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-foreground-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-foreground-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0110 0v4"></path>
    </svg>
);

const EyeIcon = ({ onClick, showPassword }: { onClick: () => void; showPassword: boolean }) => (
    <button type="button" onClick={onClick} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground-secondary)] transition-colors">
        {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        )}
    </button>
);

// University Logo Component
const UniversityLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" className="w-28 h-32 mx-auto mb-4">
        {/* Shield Background */}
        <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary-dark)" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent-light)" />
                <stop offset="50%" stopColor="var(--color-accent-hover)" />
                <stop offset="100%" stopColor="var(--color-accent-dark)" />
            </linearGradient>
        </defs>

        {/* Outer Gold Border */}
        <path d="M60 5 L110 25 L110 70 Q110 110 60 135 Q10 110 10 70 L10 25 Z" fill="url(#goldGradient)" />

        {/* Inner Blue Shield */}
        <path d="M60 12 L102 30 L102 68 Q102 104 60 126 Q18 104 18 68 L18 30 Z" fill="url(#shieldGradient)" />

        {/* Book Icon */}
        <g transform="translate(35, 50)">
            {/* Left page */}
            <path d="M25 0 Q12 5 0 10 L0 45 Q12 40 25 35 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            {/* Right page */}
            <path d="M25 0 Q38 5 50 10 L50 45 Q38 40 25 35 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            {/* Book spine */}
            <line x1="25" y1="0" x2="25" y2="35" stroke="#d97706" strokeWidth="2" />
            {/* Page lines left */}
            <line x1="8" y1="18" x2="20" y2="14" stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="8" y1="24" x2="20" y2="20" stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="8" y1="30" x2="20" y2="26" stroke="#93c5fd" strokeWidth="1.5" />
            {/* Page lines right */}
            <line x1="30" y1="14" x2="42" y2="18" stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="42" y2="24" stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="30" y1="26" x2="42" y2="30" stroke="#93c5fd" strokeWidth="1.5" />
        </g>
    </svg>
);

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
            const success = await login(formData);
            // Only navigate to dashboard if API returns successfully
            if (success) {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.');
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
        <div className="min-h-screen w-full flex relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${loginBg})` }}
            />

            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Left Side - University Branding */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative z-10 px-12">
                <div className="text-center">
                    <UniversityLogo />
                    <h1 className="text-5xl font-bold text-white tracking-wide mb-2 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {theme.university.name.split(' ')[0].toUpperCase()}
                    </h1>
                    <h2 className="text-4xl font-bold text-white tracking-wide mb-6 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {theme.university.name.split(' ').slice(1).join(' ').toUpperCase()}
                    </h2>
                    <p className="text-lg text-white/90 italic drop-shadow-md" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {theme.university.tagline}
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center relative z-10 px-4 lg:px-12">
                <div className="w-full max-w-[400px] bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-2xl)] p-8 animate-in slide-in-from-right-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{theme.university.name}</h2>
                    </div>

                    <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6 text-center">
                        College Management System
                    </h2>

                    {error && (
                        <div className="alert alert-error mb-4 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Student/Staff ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Student/Staff ID"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="input pl-10 pr-12"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <EyeIcon onClick={() => setShowPassword(!showPassword)} showPassword={showPassword} />
                                </div>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Login'}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium hover:underline transition-colors">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Contact Admin */}
                    <div className="text-center mt-3 text-sm text-[var(--color-foreground-secondary)]">
                        Need an account?{' '}
                        <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium hover:underline transition-colors">
                            Contact Admin
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 text-center py-4 bg-gradient-to-t from-black/50 to-transparent z-10">
                <p className="text-white/80 text-sm drop-shadow">
                    © {new Date().getFullYear()} {theme.university.name}. All rights reserved.
                </p>
            </div>
        </div>
    );
}
