import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Phone, MapPin, Clock, Users, Lock, Eye } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Gadi Ghar",
  description: "Learn how Gadi Ghar protects your privacy and handles your personal information. Our comprehensive privacy policy explains our data collection, use, and protection practices.",
  keywords: "privacy policy, data protection, personal information, Gadi Ghar, user privacy",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <Badge variant="outline" className="mt-4 border-red-200 text-red-700">
            <Clock className="w-3 h-3 mr-1" />
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              <a href="#information-we-collect" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                1. Information We Collect
              </a>
              <a href="#how-we-use" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                2. How We Use Information
              </a>
              <a href="#information-sharing" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                3. Information Sharing
              </a>
              <a href="#data-security" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                4. Data Security
              </a>
              <a href="#your-rights" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                5. Your Rights
              </a>
              <a href="#cookies" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                6. Cookies and Tracking
              </a>
              <a href="#third-party" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                7. Third-Party Services
              </a>
              <a href="#contact-us" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                8. Contact Us
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Gadi Ghar ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. By accessing or using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card id="information-we-collect">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Users className="w-5 h-5" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p className="text-gray-700 mb-3">We may collect the following personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed securely through third-party processors)</li>
                  <li>Communication history and support tickets</li>
                </ul>
              </div>
              
              <hr className="border-t border-gray-200 my-4" />
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Information</h3>
                <p className="text-gray-700 mb-3">We automatically collect certain information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Website usage patterns and analytics</li>
                  <li>Search queries and preferences</li>
                  <li>Pages visited and time spent on our site</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card id="how-we-use">
            <CardHeader>
              <CardTitle className="text-red-600">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We use the collected information for:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Providing and maintaining our services</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Processing transactions and bookings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Personalizing user experience</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Sending important notifications</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Improving our services and features</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Providing customer support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Analyzing usage patterns</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Complying with legal obligations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card id="information-sharing">
            <CardHeader>
              <CardTitle className="text-red-600">3. Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">With Dealerships</h4>
                  <p className="text-red-700 text-sm">
                    When you inquire about a vehicle or book a test drive, we share relevant information with authorized dealerships to facilitate the service.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Service Providers</h4>
                  <p className="text-gray-700 text-sm">
                    We may share information with trusted third-party service providers who assist in operating our website and services.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Legal Requirements</h4>
                  <p className="text-amber-700 text-sm">
                    We may disclose information when required by law or to protect our rights, property, or safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card id="data-security">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">SSL Encryption</h4>
                      <p className="text-sm text-green-600">All data transmission is encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Secure Storage</h4>
                      <p className="text-sm text-blue-600">Data stored in secure servers</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Access Control</h4>
                      <p className="text-sm text-purple-600">Limited authorized access</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Regular Monitoring</h4>
                      <p className="text-sm text-orange-600">Continuous security monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card id="your-rights">
            <CardHeader>
              <CardTitle className="text-red-600">5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <div className="space-y-3">
                {[
                  "Access: Request access to your personal data",
                  "Correction: Request correction of inaccurate data",
                  "Deletion: Request deletion of your personal data",
                  "Portability: Request transfer of your data",
                  "Objection: Object to processing of your data",
                  "Restriction: Request restriction of processing"
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card id="cookies">
            <CardHeader>
              <CardTitle className="text-red-600">6. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Cookies</h4>
                  <p className="text-gray-600 text-sm">Required for basic website functionality</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                  <p className="text-gray-600 text-sm">Help us understand how visitors use our website</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Preference Cookies</h4>
                  <p className="text-gray-600 text-sm">Remember your settings and preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card id="third-party">
            <CardHeader>
              <CardTitle className="text-red-600">7. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> We encourage you to review the privacy policies of any third-party services you access through our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card id="contact-us" className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                8. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:privacy@gadighar.com" className="text-red-600 hover:underline">
                      privacy@gadighar.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+923343149433" className="text-red-600 hover:underline">
                      +92-334-3149433
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600 text-sm">
                      Gadi Ghar<br />
                      Clifton Block 8, Karachi<br />
                      Sindh 75600, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            This Privacy Policy is effective as of <strong>{lastUpdated}</strong> and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
          </p>
        </div>
      </div>
    </div>
  );
}
