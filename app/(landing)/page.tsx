"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { featuresData, residentAssistanceData, generalPublicConcerns } from "@/constants/data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Scroll animation hooks
  const featuresHeaderAnimation = useScrollAnimation({ threshold: 0.3 });
  const contactAnimation = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitMessage("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);

    // Clear success message after 5 seconds
    setTimeout(() => setSubmitMessage(""), 5000);
  };

  return (
    <div className={`${font.className}`}>
      {/* Hero Section */}
      <div id="home" className="relative pt-4 md:pt-16 lg:pt-20 scroll-mt-20">
        <div className="absolute -top-40">
        </div>
        <div className="w-full max-w-5xl px-4 mx-auto flex flex-col justify-center items-center relative mt-2 md:mt-10 mb-8 md:mb-24">
          <div className={`flex flex-col items-center text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h2 className="text-2xl lg:text-4xl leading-tight max-w-3xl font-semibold tracking-tight mt-6">
              A Smarter, Faster, and More Secure Way to Serve Every Resident
            </h2>
            <p className="max-w-3xl mx-auto lg:text-xl text-gray-600 mt-3 leading-normal font-light">
              Empowering Barangay Macatiw through digital innovation. The Macatiw eBarangay system provides residents and barangay officials with an efficient, secure, and user-friendly platform to manage community services, requests, and records—all in one place.
            </p>
          </div>
          <div className={`w-full px-6 mt-6 relative z-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex space-x-0 sm:space-x-3 space-y-3 sm:space-y-0 flex-col sm:flex-row justify-center">


              <div className="flex flex-col md:flex-row items-center w-full sm:w-auto">
                <div className="w-full">
                  <LoginButton asChild>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto block md:hidden bg-white justify-center items-center border font-semibold tracking-wide transition truncate focus:outline-none focus:ring ring-outline-active active:shadow-active min-h-12 px-5 text-base rounded shadow-sm text-primary-base border-primary-base bg-primary-light hover:bg-fill-dark disabled:bg-fill-disabled disabled:border-outline disabled:text-disabled disabled:ring-transparent space-x-2">
                      Log In Now
                    </Button>
                  </LoginButton>
                </div>
                <p className="py-2 px-4 block md:hidden">Or</p>
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button className="w-full inline-flex justify-center items-center border font-semibold tracking-wide transition-all duration-300 hover:scale-105 truncate focus:outline-none focus:ring ring-outline-active active:shadow-active min-h-12 px-5 text-base rounded shadow-sm text-white hover:bg-primary-dark hover:ring hover:ring-offset-1 hover:ring-primary-base disabled:bg-fill-disabled disabled:border-outline disabled:text-disabled disabled:ring-transparent space-x-2">
                    Register as a resident.
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd">
                      </path>
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative w-full flex justify-center items-end pt-24 -mt-8 pointer-events-none overflow-hidden">
              <img className={`h-full w-full max-w-5xl z-10 object-cover object-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} src="/banner-img-laptop-055547cd.png" alt="" />
              <img className="absolute inset-0 h-full w-full z-0 object-cover object-center invisible" src="/bg-d773ee8b.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative overflow-hidden pb-12 md:pb-32 pt-8 md:pt-28 scroll-mt-20">
        <div className="absolute -top-40">
        </div>
        <div className="w-full max-w-5xl px-4 mx-auto grid grid-cols-1 gap-10">
          <div
            ref={featuresHeaderAnimation.elementRef}
            className={`flex items-center mx-auto transition-all duration-1000 ${featuresHeaderAnimation.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
              }`}
          >
            <div className="relative z-10 text-center max-w-xl space-y-2">
              <div className="text-2xl lg:text-4xl leading-tight max-w-3xl font-semibold tracking-tight mt-6">
                Macatiw eBarangay: Web-Based Barangay Information System
              </div>
              <div className="font-light md:text-xl text-base">
                Macatiw eBarangay transforms local governance through a secure, efficient, and user-friendly digital platform. It streamlines community services, enhances transparency, and empowers both residents and barangay officials.
              </div>
            </div>
          </div>
          <div className="">
            <div className="max-w-5xl mx-auto w-full space-y-4">
              {featuresData.map((feature, index) => {
                // Create individual hooks for each feature
                const FeatureCard = () => {
                  const featureAnimation = useScrollAnimation({
                    threshold: 0.2,
                    triggerOnce: true
                  });

                  return (
                    <div
                      key={feature.id}
                      ref={featureAnimation.elementRef}
                      className={`bg-white px-0 py-4 md:p-8 rounded-lg flex sm:flex-row flex-col items-center space-x-2 transition-all duration-700 hover:shadow-lg hover:scale-105 ${featureAnimation.isVisible
                        ? 'opacity-100 translate-x-0'
                        : index % 2 === 0
                          ? 'opacity-0 -translate-x-10'
                          : 'opacity-0 translate-x-10'
                        }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <img className="sm:mx-auto mr-auto ml-0 h-40 w-40" src={feature.image} alt={feature.title} />
                      <div className="space-y-2">
                        <div className="text-base md:text-2xl font-semibold text-left">
                          {feature.title}
                        </div>
                        <div className="text-sm md:text-base text-slate-600">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                };

                return <FeatureCard key={feature.id} />;
              })}
            </div>
          </div>
        </div>
      </div>


      {/* Contact Us Section */}
      <div id="contact" className="relative py-12 md:py-20 bg-slate-50 overflow-hidden scroll-mt-20">
        <div className="absolute -top-40"></div>
        <div className="w-full max-w-5xl px-4 mx-auto">
          <div
            ref={contactAnimation.elementRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 transition-all duration-1000 ${contactAnimation.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
              }`}
          >
            <div className="">
              <div className="text-slate-800 mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  Have a question or need assistance?
                </h2>
                <p className="text-slate-600">
                  Contact us today and our friendly team will be happy to help!
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">For general public concerns:</h3>
                <div className="space-y-2">
                  <a
                    className="text-secondary-foreground inline-flex items-center gap-2 font-semibold hover:underline underline-offset-2"
                    href={`mailto:${generalPublicConcerns.email}`}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0 text-slate-700"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {generalPublicConcerns.email}
                  </a>
                  <div className="flex items-center gap-2">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0 text-slate-700"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{generalPublicConcerns.phone} (Call Center/Hotline)</span>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {submitMessage && (
                  <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded animate-fade-in">
                    {submitMessage}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full transition-all duration-300 hover:scale-105" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send your message"}
                </Button>
              </form>
            </div>
            <div className="md:flex justify-center items-center mt-10 md:mt-0">
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-4">For resident assistance:</h3>
                <div className="divide-y">
                  {residentAssistanceData.map((assistance) => (
                    <div key={assistance.id} className="space-y-2 py-4">
                      <h4 className="text-base font-semibold">{assistance.title}</h4>
                      <div className="space-y-2 flex flex-col">
                        <a
                          className="text-secondary-foreground inline-flex items-center gap-2 font-semibold hover:underline underline-offset-2"
                          href={`mailto:${assistance.email}`}
                        >
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="w-4 h-4 shrink-0 text-slate-700"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {assistance.email}
                        </a>
                        {assistance.phone && (
                          <a
                            className="text-secondary-foreground inline-flex items-center gap-2 font-semibold hover:underline underline-offset-2"
                            href={`tel:${assistance.phone.replace(/\s/g, '')}`}
                          >
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="w-4 h-4 shrink-0 text-slate-700"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {assistance.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
