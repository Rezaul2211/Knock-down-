import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const faqs = [
  {
    questionEn: 'How to take measurements?',
    questionBn: 'কীভাবে পরিমাপ নিতে হয়?',
    answerEn: 'You can use our step-by-step measurement guide by clicking the "Measurement" button. We recommend using a soft measuring tape and following the instructions provided in the guide.',
    answerBn: 'আপনি "মেজারমেন্ট" বোতামে ক্লিক করে আমাদের ধাপে ধাপে পরিমাপ নির্দেশিকা ব্যবহার করতে পারেন। আমরা একটি নরম মেজারিং টেপ ব্যবহার করার এবং নির্দেশিকায় দেওয়া নির্দেশাবলী অনুসরণ করার পরামর্শ দিই।'
  },
  {
    questionEn: 'Fabric care instructions',
    questionBn: 'কাপড়ের যত্ন নেওয়ার নির্দেশাবলী',
    answerEn: 'For premium cotton and silk blends, we recommend dry cleaning or gentle hand wash in cold water. Do not bleach. Iron on low heat if necessary.',
    answerBn: 'প্রিমিয়াম সুতি এবং সিল্কের মিশ্রণের জন্য, আমরা ড্রাই ক্লিনিং বা ঠান্ডা জলে আলতো করে হাত ধোয়ার পরামর্শ দিই। ব্লিচ করবেন না। প্রয়োজনে কম তাপে ইস্ত্রি করুন।'
  },
  {
    questionEn: 'What is the Custom Tailored Guarantee?',
    questionBn: 'কাস্টম টেলর্ড গ্যারান্টি কী?',
    answerEn: 'If your custom outfit does not fit perfectly, we offer one free alteration within 7 days of delivery. Your satisfaction is our priority.',
    answerBn: 'আপনার কাস্টম পোশাকটি যদি পুরোপুরি ফিট না হয়, তবে আমরা ডেলিভারির ৭ দিনের মধ্যে একবার বিনামূল্যে পরিবর্তনের অফার করি। আপনার সন্তুষ্টি আমাদের অগ্রাধিকার।'
  },
  {
    questionEn: 'Delivery time & Shipping',
    questionBn: 'ডেলিভারি সময় এবং শিপিং',
    answerEn: 'Standard delivery takes 5-7 business days. Custom tailored orders may take an additional 2-3 days for perfect stitching and quality checks.',
    answerBn: 'স্ট্যান্ডার্ড ডেলিভারিতে ৫-৭ কর্মদিবস সময় লাগে। কাস্টম টেলর্ড অর্ডারের নিখুঁত সেলাই এবং মান নিয়ন্ত্রণের জন্য অতিরিক্ত ২-৩ দিন সময় লাগতে পারে।'
  }
];

export function FAQAccordion() {
  const { language } = useAppContext();
  const isBn = language === 'bn';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-10 border-t border-[#6A4C6D]/10 pt-8">
      <h3 className="text-lg font-serif italic text-[#1E293B] font-bold mb-6">
        {isBn ? 'সাধারণ জিজ্ঞাসা' : 'Common Questions'}
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border border-[#6A4C6D]/15 rounded-xl overflow-hidden bg-[#FAF9F6] transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 flex items-center justify-between bg-transparent hover:bg-[#F3EFE6]/50 transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold text-sm text-[#1E293B]">
                  {isBn ? faq.questionBn : faq.questionEn}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-[#6A4C6D] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-1 text-sm text-[#1E293B]/70 leading-relaxed border-t border-[#6A4C6D]/5">
                  {isBn ? faq.answerBn : faq.answerEn}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
