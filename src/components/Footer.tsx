import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, X, FileText, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';

export function Footer() {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-12 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Newsletter Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-xl">
          <div className="max-w-xl space-y-1.5">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest block">
              {isBn ? 'ভিআইপি অ্যাক্সেস' : 'Exclusive Access'}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif italic text-white font-bold">
              {isBn ? 'জো পোনো প্রাইভেট সার্কেলে যোগ দিন' : 'Join the Zopono Private Circle'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isBn
                ? 'নতুন কাস্টম কালেকশন লঞ্চ, আর্লি অ্যাক্সেস আমন্ত্রণ এবং বিশেষ অফার পেতে আপনার ইমেইল দিন।'
                : 'Subscribe to receive invitations for exclusive collection launches, bespoke previews, and priority tailoring access.'}
            </p>
          </div>

          <div className="lg:w-96 w-full shrink-0">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {isBn
                    ? 'ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।'
                    : 'Thank you! You have successfully joined our exclusive list.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isBn ? 'আপনার ইমেইল ঠিকানা দিন...' : 'Enter your email address...'}
                  className="w-full bg-slate-950/60 border border-slate-750 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-xs text-white placeholder-slate-500 rounded-xl px-4 py-3 transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <span>{isBn ? 'সাবস্ক্রাইব' : 'Subscribe'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & About Column */}
          <div className="space-y-3 md:col-span-1">
            <h2 className="font-serif italic text-2xl font-bold text-white tracking-wide">
              ZOPONO
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isBn
                ? 'প্রিমিয়াম কাস্টম টেলারিং এবং রেডিমেড পোশাক ব্র্যান্ড। আধুনিক ডিজাইন ও সেরা মানের কাপড়ের মেলবন্ধন।'
                : 'Premium custom bespoke tailoring and ready-to-wear clothing brand. Merging artisanal craft with modern elegance.'}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#2563EB] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E1306C] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#men" className="hover:text-white transition-colors">
                  {isBn ? 'পুরুষদের কালেকশন' : 'Men Collection'}
                </a>
              </li>
              <li>
                <a href="#women" className="hover:text-white transition-colors">
                  {isBn ? 'মহিলাদের কালেকশন' : 'Women Collection'}
                </a>
              </li>
              <li>
                <a href="#kids" className="hover:text-white transition-colors">
                  {isBn ? 'বাচ্চাদের কালেকশন' : 'Kids Collection'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'পলিসি ও শর্তাবলী' : 'Policies & Terms'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  {isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  {isBn ? 'টার্মস অ্যান্ড কন্ডিশনস' : 'Terms and Conditions'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'যোগাযোগ' : 'Contact Us'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                <a href="tel:+8801700000000" className="hover:text-white transition-colors">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                <a href="mailto:support@zopono.com" className="hover:text-white transition-colors">
                  support@zopono.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                <span>
                  {isBn ? 'ধানমন্ডি, ঢাকা, বাংলাদেশ' : 'Dhanmondi, Dhaka, Bangladesh'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Zopono Tailor. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-300 transition-colors">
              {isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-300 transition-colors">
              {isBn ? 'শর্তাবলী' : 'Terms'}
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-[#2563EB]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-lg font-bold">
                {isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
              </h3>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                {isBn
                  ? 'Zopono-তে আপনার ব্যক্তিগত তথ্যের সুরক্ষা আমাদের প্রধান অগ্রাধিকার। আমরা কীভাবে আপনার তথ্য সংগ্রহ এবং ব্যবহার করি তা নিচে দেওয়া হলো:'
                  : 'At Zopono, we value your privacy and are committed to protecting your personal data.'}
              </p>
              <h4 className="font-bold text-slate-800">1. {isBn ? 'তথ্য সংগ্রহ' : 'Information Collection'}</h4>
              <p>
                {isBn
                  ? 'অর্ডার প্রক্রিয়াকরণ ও মাপের তথ্য সংরক্ষণের জন্য আপনার নাম, ফোন নম্বর, ঠিকানা ও পরিমাপ নেওয়া হয়।'
                  : 'We collect order details, shipping addresses, phone numbers, and custom tailored measurement details.'}
              </p>
              <h4 className="font-bold text-slate-800">2. {isBn ? 'নিরাপত্তা' : 'Data Security'}</h4>
              <p>
                {isBn
                  ? 'আপনার কোনো স্পর্শকাতর তথ্য বা মাপের তালিকা তৃতীয় কোনো পক্ষের কাছে শেয়ার বা বিক্রি করা হয় না।'
                  : 'Your body measurement parameters and order history are securely stored and never sold to third parties.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-[#2563EB]">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-bold">
                {isBn ? 'টার্মস অ্যান্ড কন্ডিশনস' : 'Terms and Conditions'}
              </h3>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                {isBn
                  ? 'আমাদের সেবা গ্রহণের পূর্বে দয়া করে নিচের শর্তাবলী পড়ুন:'
                  : 'Welcome to Zopono. By placing an order, you agree to the following terms and conditions:'}
              </p>
              <h4 className="font-bold text-slate-800">1. {isBn ? 'কাস্টম সাইজিং' : 'Custom Tailoring'}</h4>
              <p>
                {isBn
                  ? 'গ্রাহকের দেওয়া নির্দিষ্ট মাপ অনুযায়ী পোশাক তৈরি করা হয়। কাস্টম পোশাক তৈরির পর পরিবর্তনের সুযোগ সীমিত।'
                  : 'Custom bespoke garments are hand-crafted according to client measurements provided at checkout.'}
              </p>
              <h4 className="font-bold text-slate-800">2. {isBn ? 'ডেলিভারি সময়' : 'Delivery & Timeline'}</h4>
              <p>
                {isBn
                  ? 'সাধারণত কাস্টম অর্ডারের ক্ষেত্রে ৩-৭ কর্মদিবসের মধ্যে ডেলিভারি প্রদান করা হয়।'
                  : 'Standard delivery for bespoke custom orders typically completes within 3 to 7 business days.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
