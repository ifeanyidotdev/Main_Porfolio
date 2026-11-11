import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MapPin, Phone, Mail, Check, Copy } from 'lucide-react';
import Tilt3DCard from './Tilt3DCard';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('https://formspree.io/f/mwpojoql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // Allow UI confirmation
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! I will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 1000);
  };

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard?.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-4 w-4" />,
      text: 'Nigeria, NG',
    },
    {
      icon: <Phone className="h-4 w-4" />,
      text: '+234 90-3175-7021',
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: 'contact@ifeanyi.dev',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10 contact-reveal">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-content-primary">
          Contact
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 contact-reveal">
          <Tilt3DCard intensity={4} glare={true}>
            <div className="geist-card p-8 sm:p-10 h-full flex flex-col justify-between bg-surface-elevated">
              <p className="text-base sm:text-lg text-content-secondary leading-relaxed mb-8">
                Have a project in mind or want to discuss collaboration opportunities? I’d love to
                hear from you! Fill out the form or reach me through any of the contact methods
                listed.
              </p>

              <div className="space-y-3.5 relative z-30">
                {contactInfo.map((info, index) => {
                  const isCopied = copiedIndex === index;
                  return (
                    <button
                      key={info.text}
                      type="button"
                      onClick={() => handleCopy(info.text, index)}
                      className="w-full group flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-all duration-200 text-left"
                      title={`Click to copy ${info.text}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-full bg-brand-container text-brand-onContainer group-hover:bg-surface-bg/20 group-hover:text-brand-onPrimary flex items-center justify-center shrink-0 transition-colors">
                          {info.icon}
                        </div>
                        <span className="text-sm sm:text-base font-mono font-medium">
                          {info.text}
                        </span>
                      </div>
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                        {isCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Tilt3DCard>
        </div>

        <div className="lg:col-span-7 contact-reveal">
          <Tilt3DCard intensity={3} glare={true}>
            <div className="geist-card p-8 sm:p-12 relative">
              <div className="geist-grid-beam top-0 left-0" />
              <form
                onSubmit={handleSubmit}
                className="space-y-5 relative z-30"
                action="https://formspree.io/f/mwpojoql"
                method="POST"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-content-primary mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3.5 bg-surface-elevated border border-brand-border focus:border-brand-fill rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-fill/30 text-content-primary placeholder:text-content-muted transition-all"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-content-primary mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3.5 bg-surface-elevated border border-brand-border focus:border-brand-fill rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-fill/30 text-content-primary placeholder:text-content-muted transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-content-primary mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-surface-elevated border border-brand-border focus:border-brand-fill rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-fill/30 text-content-primary placeholder:text-content-muted transition-all"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-content-primary mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3.5 bg-surface-elevated border border-brand-border focus:border-brand-fill rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-fill/30 text-content-primary placeholder:text-content-muted resize-y transition-all"
                    placeholder="Hello, I'd like to discuss a project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="geist-btn-primary w-full sm:w-auto disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div
                    role="status"
                    className="p-4 rounded-xl bg-brand-container text-brand-onContainer border border-brand-border text-sm font-medium"
                  >
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </Tilt3DCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
