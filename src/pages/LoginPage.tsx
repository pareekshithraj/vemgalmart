import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';
import { Store, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../lib/api';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                identifier: formData.email, // We use the email field for both email/phone input
                password: formData.password
            });

            const data = response.data;

            login(data.user, data.token);
            addToast('Login successful!', 'success');

            // Redirect based on role
            if (data.user.role === 'seller') navigate('/seller');
            else if (data.user.role === 'delivery_man') navigate('/delivery');
            else if (data.user.role === 'ADMIN') navigate('/admin');
            else navigate('/');

        } catch (error: any) {
            addToast(error.response?.data?.message || 'Login failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link to="/" className="flex items-center gap-2 mb-8 group">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Store className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Vemgal Mart</span>
                    </Link>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email or Phone
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:hidden" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                    placeholder="you@example.com or +91..."
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary hover:text-primary-dark">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-primary/30'}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Secure & encrypted
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/60 z-10" />
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                    src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop"
                    alt="Shopping at Vemgal Mart"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
                    <h3 className="text-4xl font-bold mb-4">Shop smarter, live better.</h3>
                    <p className="text-lg text-gray-200 max-w-md">
                        Experience the fastest delivery service in Vemgal. Fresh groceries, daily essentials, and more, right at your doorstep.
                    </p>
                </div>
            </div>
        </div>
    );
};
