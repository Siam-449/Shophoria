"use client";

import React, { useState } from 'react';
import { EmailIcon } from '../../components/icons/EmailIcon';
import { PhoneIcon } from '../../components/icons/PhoneIcon';
import { LocationIcon } from '../../components/icons/LocationIcon';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Get in touch with our team. We're here to help with any questions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left Side: Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            {submitted ? (
              <div className="bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-md" role="alert">
                <strong className="font-bold">Thank you!</strong>
                <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
              </div>
            ) : (
              <>
                <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>
                <form 
                  action="https://docs.google.com/forms/d/1a8gpJc3Gz5RqjjQAlFAh1VR_wlcWMWNeQR3Y70ipnog/formResponse" 
                  method="POST" 
                  target="hidden_iframe"
                  onSubmit={() => setTimeout(() => setSubmitted(true), 100)}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="entry.1515168718"
                      id="name"
                      autoComplete="name"
                      required
                      className="block w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="entry.685040257"
                      id="email"
                      autoComplete="email"
                      required
                      className="block w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      name="entry.536629935"
                      id="subject"
                      required
                      className="block w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="entry.1948820010"
                      rows={4}
                      required
                      className="block w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={''}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Right Side: Contact Info & Store Hours */}
          <div className="space-y-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <EmailIcon className="flex-shrink-0 h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Email</h3>
                    <a href="mailto:sami221754bcic@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">sami221754bcic@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="flex-shrink-0 h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">+8801897-784882</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LocationIcon className="flex-shrink-0 h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Address</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Mirpur-1<br />
                      Dhaka<br />
                      Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Store Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Saturday - Thursday</span>
                  <span>10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Friday</span>
                  <span>12:00 PM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
