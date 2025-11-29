
import React, { useState } from 'react';
import { MailIcon, PhoneCallIcon, LocationMarkerIcon, SpinnerIcon } from './IconComponents';

// EmailJS is loaded from a script tag in index.html, so we declare it for TypeScript
declare global {
  interface Window {
    emailjs: {
      send: (serviceID: string, templateID: string, templateParams: Record<string, unknown>, publicKey: string) => Promise<any>;
    };
  }
}


export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- IMPORTANT ---
  // These keys must be set as an environment variables in your project's secrets.
  const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError("Contact form is not configured. Please provide EmailJS credentials as environment variables.");
      return;
    }

    if (!name || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('EmailJS Success:', response.status, response.text);
        setSubmitted(true);
      }, (err) => {
        console.error('EmailJS Failed:', err);
        setError('Failed to send message. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <MailIcon className="mx-auto h-16 w-16 text-primary opacity-80" />
            <h1 className="mt-4 text-4xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">
              We'd love to hear from you! Whether you have a question, feedback, or need assistance, feel free to reach out.
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-800">Send us a message</h2>
              {submitted ? (
                <div className="mt-6 flex flex-col items-center justify-center h-full text-center">
                   <svg className="w-16 h-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4">Thank you!</h3>
                  <p className="text-gray-600 mt-2">Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required disabled={loading} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"></textarea>
                  </div>
                  <div>
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors flex justify-center items-center disabled:bg-orange-300 disabled:cursor-not-allowed">
                       {loading ? (
                        <>
                          <SpinnerIcon className="w-5 h-5 mr-3" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                   {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </form>
              )}
            </div>
            <div className="p-8 lg:p-12 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
              <div className="mt-6 space-y-6 text-gray-600">
                <div className="flex items-start space-x-4">
                  <LocationMarkerIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Our Address</h3>
                    <p>456 Commerce Avenue, Sale City, 67890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneCallIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Call Us</h3>
                    <p>(555) 987-6543</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MailIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Us</h3>
                    <p>contact@shopperssay.demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
