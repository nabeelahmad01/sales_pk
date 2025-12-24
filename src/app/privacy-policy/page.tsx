import Link from "next/link";
import "@/app/styles/policy.css";

export const metadata = {
  title: "Privacy Policy | ShowSales.pk",
  description:
    "Privacy Policy for ShowSales.pk - Pakistan's leading sale discovery platform",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Last updated: December 24, 2024</p>
        </div>
      </section>

      <div className="policy-page">
        <div className="container">
          <div className="policy-content">
            <section>
              <h2>1. Introduction</h2>
              <p>
                Welcome to ShowSales.pk ("we," "our," or "us"). We are committed
                to protecting your personal information and your right to
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website showsales.pk and use our services.
              </p>
              <p>
                By accessing or using our website, you agree to the collection
                and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
                <li>Participate in promotions or surveys</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address</li>
                <li>Payment information</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>
                When you visit our website, we automatically collect certain
                information, including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the collected information for various purposes:</p>
              <ul>
                <li>To process and fulfill your orders</li>
                <li>To send you sale alerts and promotional offers</li>
                <li>To improve our website and services</li>
                <li>
                  To respond to your inquiries and provide customer support
                </li>
                <li>To send administrative information</li>
                <li>To protect against fraudulent transactions</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>4. Information Sharing</h2>
              <p>We may share your information in the following situations:</p>
              <ul>
                <li>
                  <strong>With Brand Partners:</strong> When you make a
                  purchase, we share necessary order details with the respective
                  brand for fulfillment.
                </li>
                <li>
                  <strong>Payment Processors:</strong> We use third-party
                  payment processors (JazzCash, EasyPaisa, PayFast) to process
                  payments securely.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with service providers who assist us in operating our website.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or in response to valid legal
                  requests.
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the Internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
              <p>
                All payment transactions are encrypted using SSL technology. We
                do not store your complete credit card information on our
                servers.
              </p>
            </section>

            <section>
              <h2>6. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our website and store certain information. Cookies
                help us improve your experience by:
              </p>
              <ul>
                <li>Remembering your preferences</li>
                <li>Understanding how you use our website</li>
                <li>Providing personalized content</li>
              </ul>
              <p>
                You can configure your browser to refuse cookies, but this may
                limit your ability to use certain features.
              </p>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at
                privacy@showsales.pk
              </p>
            </section>

            <section>
              <h2>8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to read the privacy policies of any
                linked websites.
              </p>
            </section>

            <section>
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                minor, please contact us immediately.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="contact-box">
                <p>
                  <strong>ShowSales.pk</strong>
                </p>
                <p>190 B Sector C, Jasmine Block</p>
                <p>Bahria Town, Lahore, Pakistan</p>
                <p>Email: ahmadnabeel634@gmail.com</p>
                <p>Phone/WhatsApp: +92 309 0761071</p>
              </div>
            </section>
          </div>

          <div className="policy-footer">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
