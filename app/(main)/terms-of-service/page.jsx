import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Scale, Mail, Phone, MapPin, Clock, FileText, AlertTriangle, Shield, Users } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Gadi Ghar",
  description: "Read Gadi Ghar's terms of service to understand your rights and responsibilities when using our platform. Our terms cover user conduct, services, and legal obligations.",
  keywords: "terms of service, user agreement, legal terms, Gadi Ghar, terms and conditions",
};

export default function TermsOfServicePage() {
  const lastUpdated = "January 1, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of Gadi Ghar services. Please read them carefully before using our platform.
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
              <FileText className="w-5 h-5" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              <a href="#acceptance" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                1. Acceptance of Terms
              </a>
              <a href="#description" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                2. Description of Service
              </a>
              <a href="#user-accounts" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                3. User Accounts
              </a>
              <a href="#prohibited-uses" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                4. Prohibited Uses
              </a>
              <a href="#content-policy" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                5. Content Policy
              </a>
              <a href="#payment-terms" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                6. Payment Terms
              </a>
              <a href="#disclaimers" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                7. Disclaimers
              </a>
              <a href="#limitation-liability" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                8. Limitation of Liability
              </a>
              <a href="#termination" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                9. Termination
              </a>
              <a href="#contact-us" className="text-blue-600 hover:text-blue-800 hover:underline py-1">
                10. Contact Information
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card id="acceptance">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Scale className="w-5 h-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Gadi Ghar ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. These Terms of Service ("Terms") constitute a legally binding agreement between you and Gadi Ghar.
              </p>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card id="description">
            <CardHeader>
              <CardTitle className="text-red-600">2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 mb-4">
                Gadi Ghar is an online platform that provides:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Vehicle listings and search functionality</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Connection between buyers and sellers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Test drive booking services</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Vehicle information and resources</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">EMI calculation tools</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Dealership directory services</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card id="user-accounts">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Users className="w-5 h-5" />
                3. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Creation</h3>
                <p className="text-gray-700 mb-3">When creating an account, you must:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Security</h3>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    You are responsible for maintaining the security of your account and password. Gadi Ghar cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card id="prohibited-uses">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                4. Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">You may not use our service for any unlawful or prohibited activities, including:</p>
              <div className="space-y-3">
                {[
                  "Fraudulent or misleading vehicle listings",
                  "Harassment or abuse of other users",
                  "Spamming or unsolicited communications",
                  "Violating any applicable laws or regulations",
                  "Attempting to gain unauthorized access to our systems",
                  "Interfering with the proper functioning of the service",
                  "Using the service for commercial purposes without permission",
                  "Posting false or defamatory content"
                ].map((prohibition, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700 text-sm">{prohibition}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Policy */}
          <Card id="content-policy">
            <CardHeader>
              <CardTitle className="text-red-600">5. Content Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">User-Generated Content</h3>
                <p className="text-gray-700 mb-3">
                  By posting content on our platform, you grant us a non-exclusive license to use, modify, and display your content for service-related purposes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Content Standards</h3>
                <p className="text-gray-700 mb-3">All content must be:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Accurate and truthful</li>
                  <li>Non-infringing of third-party rights</li>
                  <li>Appropriate and family-friendly</li>
                  <li>Compliant with applicable laws</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> We reserve the right to remove any content that violates these standards without prior notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card id="payment-terms">
            <CardHeader>
              <CardTitle className="text-red-600">6. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Fees</h3>
                <p className="text-gray-700 mb-3">
                  Some services may require payment of fees. All fees are non-refundable unless otherwise stated.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Third-Party Payments</h3>
                <p className="text-gray-700 mb-3">
                  Vehicle purchases are conducted directly between buyers and sellers/dealerships. Gadi Ghar is not responsible for payment disputes or transaction issues.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Reminder:</strong> Always verify vehicle details and dealer credentials before making any payment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card id="disclaimers">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                7. Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <h4 className="font-semibold mb-2">Service "As Is"</h4>
                <p className="text-gray-700 text-sm">
                  Our service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted or error-free.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <h4 className="font-semibold mb-2">Vehicle Information</h4>
                <p className="text-gray-700 text-sm">
                  We do not guarantee the accuracy, completeness, or reliability of vehicle listings. Users should independently verify all vehicle information before making decisions.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <h4 className="font-semibold mb-2">Third-Party Content</h4>
                <p className="text-gray-700 text-sm">
                  We are not responsible for the content, accuracy, or opinions expressed in user-generated content or third-party materials.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card id="limitation-liability">
            <CardHeader>
              <CardTitle className="text-red-600">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Gadi Ghar shall not be liable for:
              </p>
              <div className="space-y-2">
                {[
                  "Indirect, incidental, or consequential damages",
                  "Loss of profits, data, or business opportunities",
                  "Damages resulting from third-party content or services",
                  "Issues arising from vehicle transactions between users",
                  "Technical failures or service interruptions"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                <p className="text-amber-800 text-sm">
                  <strong>Important:</strong> Our total liability shall not exceed the amount paid by you for the services, if any, during the 12 months prior to the event giving rise to liability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card id="termination">
            <CardHeader>
              <CardTitle className="text-red-600">9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">By You</h3>
                <p className="text-gray-700 mb-3">
                  You may terminate your account at any time by contacting our support team or using the account deletion feature.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">By Us</h3>
                <p className="text-gray-700 mb-3">
                  We may terminate or suspend your account immediately, without prior notice, for any reason including violation of these Terms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Effect of Termination</h3>
                <p className="text-gray-700 mb-3">
                  Upon termination, your right to use the service ceases immediately. We may retain certain information as required by law or for legitimate business purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card id="contact-us" className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                10. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:legal@gadighar.com" className="text-red-600 hover:underline">
                      legal@gadighar.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+92-XXX-XXXXXXX" className="text-red-600 hover:underline">
                      +92-XXX-XXXXXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600 text-sm">
                      Gadi Ghar Legal Department<br />
                      [Your Address]<br />
                      Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Notice */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-3">Additional Legal Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of Pakistan.
            </p>
            <p>
              <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remainder shall continue in full force and effect.
            </p>
            <p>
              <strong>Changes to Terms:</strong> We reserve the right to modify these terms at any time. Users will be notified of significant changes.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-700">
            These Terms of Service are effective as of <strong>{lastUpdated}</strong>. By continuing to use our service after any modifications, you agree to be bound by the revised terms.
          </p>
        </div>
      </div>
    </div>
  );
}
