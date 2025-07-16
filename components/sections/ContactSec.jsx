import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, Facebook, X } from "lucide-react";
import Image from "next/image";

const ContactSec = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black">
                Contact Us
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get in touch with us for any inquiries. We're here to help and
                answer any questions you might have.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">📧</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href="mailto:info@gadighar.com"
                    className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium"
                  >
                    info@gadighar.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">📞</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <a
                    href="tel:+923431494933"
                    className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium"
                  >
                    +92 343 149 4933
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
                Contact Now
              </Button>
            </div>

            {/* Car Showroom Image */}
            <div className="mt-8 ">
              <Image
                src="/car-showroom.jpg"
                alt="Car Showroom Interior"
                width={300}
                height={200}
                className="w-full h-[300px]  rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Right Side - Map and Social Media */}
          <div className="space-y-8">
            {/* Map Section */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <div className="h-96 w-full">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d226.31209464105547!2d67.04303588662835!3d24.82989541371536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2s!4v1752582244427!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <a
                    href="https://www.google.com/maps/search/Saddar,+karachi,+Sindh,+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 font-medium hover:text-red-600 transition-colors duration-300"
                  >
                    Saddar, Karachi, Sindh, Pakistan
                  </a>
                  <a
                    href="https://www.google.com/maps/search/Saddar,+karachi,+Sindh,+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm mt-1 block hover:text-red-600 transition-colors duration-300"
                  >
                    Visit us at our office location
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold text-black mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/923431494933"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                </a>
                <a
                  href="https://facebook.com/CodeFectly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                >
                  <Facebook className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                </a>
                <a
                  href="https://twitter.com/CodeFectly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                >
                  <X className="w-6 h-6 text-gray-600 group-hover:text-gray-700" />
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Connect with us on social media for updates and news
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSec;
