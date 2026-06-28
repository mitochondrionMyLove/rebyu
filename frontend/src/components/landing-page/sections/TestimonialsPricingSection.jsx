import React from 'react';

import Button from '../fragments/Button';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'For students starting their review routine.',
    features: ['Starter lessons', 'Community discussions', 'Basic progress tracking', '1 mock exam per month'],
    cta: 'Try Rebyu free',
    variant: 'secondary',
  },
  {
    name: 'Rebyu Pro',
    price: 'P299',
    period: '/mo',
    description: 'For serious exam takers who want full preparation.',
    features: ['Everything in Basic', 'Full lesson access', 'Unlimited flashcards and mock exams', 'Unlimited challenges'],
    cta: 'Get started',
    variant: 'primary',
    featured: true,
  },
  {
    name: 'Premium',
    price: 'P1,599',
    period: '/year',
    description: 'For long-term review and scholarship planning.',
    features: ['Everything in Pro', 'Yearly savings', 'Priority AI tutor access', 'Scholarship tracking'],
    cta: 'Choose yearly',
    variant: 'secondary',
  },
];

const TestimonialsPricingSection = () => {
  return (
    <section className="container section-padding" id="pricing">
      <div className="testimonials-section" id="testimonials">
        <h2 className="quote-text">
          "Rebyu showed me what to study next instead of making me guess."
        </h2>
        <div className="quote-author">
          <div className="author-avatar">MP</div>
          <div className="author-info">
            <strong>Martha Punla</strong>
            <span>UP entrance exam taker</span>
          </div>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <p>"The mock exams helped me practice under time pressure, and the explanations made my mistakes easier to fix."</p>
            <div className="review-author">
              <div className="avatar-small">LD</div>
              <div className="author-info">
                <strong>Leah Daniel</strong>
                <span>Scholarship applicant</span>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p>"I uploaded my notes and got flashcards right away. It saved me hours before review week."</p>
            <div className="review-author">
              <div className="avatar-small">SW</div>
              <div className="author-info">
                <strong>Sergio Walker</strong>
                <span>STEM student</span>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p>"The scholarship tracker helped me avoid missing deadlines while preparing for exams."</p>
            <div className="review-author">
              <div className="avatar-small">JJ</div>
              <div className="author-info">
                <strong>Jane Joy</strong>
                <span>Grade 12 student</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-section">
        <div className="content-eyebrow pricing-eyebrow">PRICING</div>
        <h2 className="pricing-heading">Simple, affordable plans for every student</h2>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div className={`pricing-card ${plan.featured ? 'pro-card' : ''}`} key={plan.name}>
              <div className="tier-header">
                <div className="tier-name">{plan.name}</div>
                {plan.featured && <span className="badge-save">Most popular</span>}
              </div>
              <div className="tier-price">{plan.price}{plan.period && <span>{plan.period}</span>}</div>
              <p className="tier-desc">{plan.description}</p>
              <ul className="tier-features">
                {plan.features.map((feature) => (
                  <li key={feature}>Included: {feature}</li>
                ))}
              </ul>
              <Button variant={plan.variant} className="pricing-btn">{plan.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPricingSection;
