
import React from 'react';
import { MailIcon, FacebookIcon, InstagramIcon } from './IconComponents';

interface FooterProps {
    onContactClick: () => void;
    onHomeClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick, onHomeClick }) => {
    return (
        <footer className="relative bg-gray-900 text-white overflow-hidden hidden md:block">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://i.postimg.cc/PfWbs9X3/Whats-App-Image-2025-11-18-at-12-18-35-PM.jpg" 
                    alt="Footer Background" 
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/80"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()}. All rights reserved.</p>
                    </div>
                    <div className="flex items-center space-x-8 mt-8 md:mt-0">
                        <div className="flex space-x-6">
                            <a href="#" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="text-sm text-gray-300 hover:text-white transition-colors font-medium">Home</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }} className="flex items-center text-sm text-gray-300 hover:text-white transition-colors font-medium">
                                <MailIcon className="w-4 h-4 mr-2" />
                                Contact Us
                            </a>
                        </div>
                        <div className="h-6 w-px bg-gray-700"></div>
                        <div className="flex items-center space-x-4">
                            <a href="https://www.instagram.com/shopperssay2?igsh=MWVxaXlta3Q4NTZybg==" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-gray-400 hover:text-white transition-colors">
                                <InstagramIcon className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="Follow us on Facebook" className="text-gray-400 hover:text-white transition-colors">
                                <FacebookIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
