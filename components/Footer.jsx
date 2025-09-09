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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated with Latest Cars
            </h3>
            <p className="text-white mb-6">
              Subscribe to our newsletter and get notifications about new cars, price drops, and exclusive deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="flex-1 bg-red-700 border-red-800 text-white placeholder:text-red-200 focus:border-red-300"
              />
              <Button type="submit" className="bg-red-800 hover:bg-red-900 whitespace-nowrap">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/GariGharBlack.png"
                alt="Gadi Ghar Logo"
                width={200}
                height={50}
                className="object-contain h-auto"
                style={{ height: "auto" }}
              />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Pakistan's leading car marketplace connecting buyers and sellers. Find your dream car or sell your current one with ease.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="tel:+923431494933" className="hover:text-red-600 transition-colors">
                  +92 343 149 4933
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:info@gadighar.com" className="hover:text-red-600 transition-colors">
                  info@gadighar.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  Shop #23, M.A. Jinnah Road,<br />
                  Saddar, Karachi, Sindh,<br />
                  Pakistan - 74400
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-colors ${social.color} hover:bg-gray-200`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-3">
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © {currentYear} Gadi Ghar. All rights reserved. Made with ❤️ for car enthusiasts.
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors">
              About
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
              Contact
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
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

      {/* Back to Top Button - Hidden on mobile, shown on desktop */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hidden md:flex items-center justify-center z-50"
        aria-label="Back to top"
      >
        <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
      </Button>
    </footer>
  );
};
export default Footer;
