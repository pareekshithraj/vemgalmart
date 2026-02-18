import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';
import { Store, User, Mail, Lock, ArrowRight, Loader2, Truck, Phone } from 'lucide-react';
import api from '../lib/api';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRoleSelect = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            addToast("Passwords don't match", 'error');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                // @ts-ignore
                shopName: formData.shopName,
                role: formData.role
            });

            const data = response.data;

            login(data.user, data.token);
            addToast('Welcome to Vemgal Mart!', 'success');

            if (data.user.role === 'seller') navigate('/seller');
            else if (data.user.role === 'delivery_man') navigate('/delivery');
            else navigate('/');

        } catch (error: any) {
            addToast(error.response?.data?.message || error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Right Side (on large screens) - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 order-last lg:order-first">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link to="/" className="flex items-center gap-2 mb-8 group">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Store className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Vemgal Mart</span>
                    </Link>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Role Selection Cards */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { id: 'buyer', icon: User, label: 'Buyer' },
                                { id: 'seller', icon: Store, label: 'Seller' },
                                { id: 'delivery_man', icon: Truck, label: 'Delivery' }
                            ].map((role) => (
                                <button
                                    type="button"
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.role === role.id
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <role.icon className={`h-6 w-6 mb-1 ${formData.role === role.id ? 'text-primary' : 'text-gray-400'}`} />
                                    <span className="text-xs font-semibold">{role.label}</span>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {formData.role === 'seller' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Store className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        name="shopName"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                        placeholder="My Super Store"
                                        // @ts-ignore
                                        value={formData.shopName || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Member</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-primary/30'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Get Started <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-500">
                        By signing up, you agree to our{' '}
                        <a href="#" className="font-medium text-gray-900 hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-gray-900 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>

            {/* Left Side (on large screens) - Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 order-first lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 to-black/60 z-10" />
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                    alt="Grocery Shopping"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
                    <h3 className="text-4xl font-bold mb-4">Join the family.</h3>
                    <p className="text-lg text-gray-200 max-w-md">
                        Whether you're buying, selling, or delivering, Vemgal Mart connects you to your community.
                    </p>
                </div>
            </div>
        </div>
    );
};
