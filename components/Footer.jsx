"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Car, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Scale,
  Users,
  Building,
  CarFront,
  Heart,
  Search,
  Info,
  Star,
  MessageCircle,
  Github
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Search Cars", href: "/cars", icon: Search },
    { name: "Saved Cars", href: "/saved-cars", icon: Heart },
    { name: "Blogs", href: "/blogs", icon: Info },
  ];

  const aboutLinks = [
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact Us", href: "/contact", icon: Phone },
    { name: "Dealership Signup", href: "/dealership-signup", icon: Building },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
    { name: "Terms of Service", href: "/terms-of-service", icon: Scale },
  ];

  const carBrands = [
    "Honda", "Toyota", "Suzuki", "Hyundai", "Nissan", 
    "Mercedes", "BMW", "Audi", "Volkswagen", "Ford"
  ];

  const socialLinks = [
    { name: "WhatsApp", href: "https://wa.me/923431494933", icon: MessageCircle, color: "hover:text-green-600" },
    { name: "Facebook", href: "https://facebook.com/CodeFectly", icon: Facebook, color: "hover:text-blue-600" },
    { name: "Twitter", href: "https://twitter.com/CodeFectly", icon: Twitter, color: "hover:text-blue-400" },
    { name: "Instagram", href: "https://instagram.com/codefectly", icon: Instagram, color: "hover:text-pink-600" },
    { name: "LinkedIn", href: "https://linkedin.com/company/codefectly", icon: Linkedin, color: "hover:text-blue-700" },
    { name: "GitHub", href: "https://github.com/hamzaisadev", icon: Github, color: "hover:text-gray-800" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    const formData = new FormData(e.target);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
    // Add your newsletter subscription logic here
  };

  return (
    <footer className="bg-white text-gray-800">
      {/* Newsletter Section */}
      <div className="bg-red-600 border-b border-red-700">
        <div className="container-responsive mx-auto section-spacing-sm">
          <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto text-center">
            <h3 className="text-responsive-lg font-bold text-white mb-2 sm:mb-3">
              Stay Updated with Latest Cars
            </h3>
            <p className="text-white mb-4 sm:mb-6 text-sm sm:text-base px-4 sm:px-0">
              Subscribe to our newsletter and get notifications about new cars, price drops, and exclusive deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col xs:flex-row gap-2 sm:gap-3 max-w-sm xs:max-w-md mx-auto px-4 xs:px-0">
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 bg-red-700 border-red-800 text-white placeholder:text-red-200 focus:border-red-300 text-sm sm:text-base h-10 sm:h-11"
              />
              <Button type="submit" className="bg-red-800 hover:bg-red-900 whitespace-nowrap touch-target text-sm sm:text-base h-10 sm:h-11 px-3 sm:px-4">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Subscribe
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-responsive mx-auto section-spacing">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/GariGharBlack.png"
                alt="Gadi Ghar Logo"
                width={200}
                height={50}
                className="object-contain h-auto w-40 sm:w-48 md:w-52"
                style={{ height: "auto" }}
              />
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Pakistan's leading car marketplace connecting buyers and sellers. Find your dream car or sell your current one with ease.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <a href="tel:+923431494933" className="hover:text-red-600 transition-colors touch-target-sm">
                  +92 343 149 4933
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:info@gadighar.com" className="hover:text-red-600 transition-colors touch-target-sm">
                  info@gadighar.com
                </a>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="leading-4 sm:leading-5">
                  Shop #23, M.A. Jinnah Road,<br />
                  Saddar, Karachi, Sindh,<br />
                  Pakistan - 74400
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center transition-colors ${social.color} hover:bg-gray-200 touch-target`}
                    aria-label={social.name}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:text-red-600" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Popular Car Brands */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold text-gray-800 mb-3">Popular Brands</h5>
              <div className="flex flex-wrap gap-2">
                {carBrands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand}
                    href={`/cars?make=${brand}`}
                    className="text-xs bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Company</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:text-red-600" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Legal & Support</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:text-red-600" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200"></div>
      <div className="container-responsive mx-auto py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            © {currentYear} Gadi Ghar. All rights reserved. Made with ❤️ for car enthusiasts.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors touch-target-sm">
              About
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="text-gray-600 hover:text-red-600 transition-colors touch-target-sm">
              Contact
            </Link>
            <span className="text-gray-400 hidden xs:inline">•</span>
            <span className="text-gray-600 hidden xs:inline">
              Made in 🇵🇰 Pakistan
            </span>
          </div>
        </div>
      </div>

      {/* Developer Credit Bar */}
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-300">
            Made with ❤️ by{" "}
            <a
              href="https://linkedin.com/in/hamzaisadev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 font-medium transition-colors underline decoration-dotted"
            >
              Hamza Ishaq
            </a>
          </p>
        </div>
      </div>

      {/* Back to Top Button - Responsive positioning */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center z-50 touch-target"
        aria-label="Back to top"
      >
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-[-90deg]" />
      </Button>
    </footer>
  );
};
export default Footer;
