import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What exams does Rebyu cover?",
    answer: "Rebyu covers all major Philippine scholarship and college entrance examinations, including UPCAT, ACET, DOST-SEI, USTET, DCAT, PLMAT, and more."
  },
  {
    question: "How does the AI tutor work?",
    answer: "Our AI tutor provides instant explanations, step-by-step solutions, and simplified discussions. You can upload your own notes, and the AI will generate flashcards, quizzes, and mock exams tailored to your weak areas."
  },
  {
    question: "Can I study offline?",
    answer: "Currently, Rebyu requires an internet connection to access the AI features and sync your progress. However, you can download specific notes and reviewers for offline reading."
  },
  {
    question: "Is there a free version available?",
    answer: "Yes! We offer a Basic plan that gives you limited access to lessons, community discussions, and basic progress tracking completely for free."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container section-padding faq-section" id="faq">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Got questions? We've got answers.</p>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'active' : ''}`}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
