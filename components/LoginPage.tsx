
import React, { useState } from 'react';
import { 
    EyeIcon, 
    EyeOffIcon, 
    UserIcon, 
    MailIcon, 
    PhoneCallIcon, 
    LocationMarkerIcon, 
    BriefcaseIcon, 
    LockClosedIcon, 
    ArrowRightIcon
} from './IconComponents';
import { Logo } from './Logo';

interface LoginPageProps {
    onLogin: (details: {
        email: string;
        password?: string;
        name: string;
        phone: string;
        address: string;
        accountType: 'user' | 'business';
    }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [accountType, setAccountType] = useState<'user' | 'business'>('user');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ email, password, name, phone, address, accountType });
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Dynamic Branding */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://i.postimg.cc/PfWbs9X3/Whats-App-Image-2025-11-18-at-12-18-35-PM.jpg" 
                        alt="Shopping Lifestyle" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-900/80"></div>
                </div>
                
                <div className="relative z-10 flex flex-col justify-between w-full p-12">
                    <div>
                        <Logo className="h-16 w-auto mb-8 filter brightness-0 invert" />
                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-shadow-md">
                            Discover. <br/>
                            <span className="text-primary">Buy.</span> <br/>
                            Sell.
                        </h1>
                        <p className="mt-6 text-lg text-gray-100 max-w-sm leading-relaxed font-medium drop-shadow-sm">
                            Join the marketplace where opportunities meet. Find exactly what you need, or turn your items into cash in minutes.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                                <BriefcaseIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold drop-shadow-sm">For Business</p>
                                <p className="text-sm text-gray-200">Grow your reach instantly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                                <UserIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold drop-shadow-sm">For Everyone</p>
                                <p className="text-sm text-gray-200">Safe and easy transactions</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-gray-300/80">
                        &copy; {new Date().getFullYear()}. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
                <div className="max-w-md w-full">
                    {/* Logo - Visible on all screens */}
                    <div className="text-center mb-8">
                         <Logo className="h-32 mx-auto" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {isRegistering ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {isRegistering 
                                    ? 'Enter your details to get started' 
                                    : 'Please enter your details to sign in'
                                }
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {isRegistering && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setAccountType('user')}
                                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                                            accountType === 'user' 
                                            ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary ring-opacity-50' 
                                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <UserIcon className="w-6 h-6" />
                                        <span className="font-bold text-sm">Personal</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setAccountType('business')}
                                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                                            accountType === 'business' 
                                            ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary ring-opacity-50' 
                                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <BriefcaseIcon className="w-6 h-6" />
                                        <span className="font-bold text-sm">Business</span>
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {isRegistering && (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors sm:text-sm"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors sm:text-sm"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        autoComplete={isRegistering ? 'new-password' : 'current-password'}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible 
                                            ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" /> 
                                            : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        }
                                    </button>
                                </div>

                                {isRegistering && (
                                    <>
                                         <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PhoneCallIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors sm:text-sm"
                                                placeholder="Phone Number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                                <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows={2}
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors sm:text-sm"
                                                placeholder="Shipping Address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="group w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                {isRegistering ? 'Create Account' : 'Sign In'}
                                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                             <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        {isRegistering ? 'Already have an account?' : 'New here?'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="mt-4 font-medium text-primary hover:text-orange-600 transition-colors"
                            >
                                {isRegistering ? 'Sign In Here' : 'Create an Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
