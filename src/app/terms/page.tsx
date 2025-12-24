import Link from "next/link";
import "@/app/styles/policy.css";

export const metadata = {
  title: "Terms & Conditions | ShowSales.pk",
  description:
    "Terms and Conditions for ShowSales.pk - Pakistan's leading sale discovery platform",
};

export default function TermsPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>Last updated: December 24, 2024</p>
        </div>
      </section>

      <div className="policy-page">
        <div className="container">
          <div className="policy-content">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to ShowSales.pk. These Terms and Conditions ("Terms")
                govern your use of our website showsales.pk and all related
                services (collectively, the "Service"). By accessing or using
                our Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree to these Terms, please do not use our
                Service. We reserve the right to modify these Terms at any time,
                and your continued use of the Service constitutes acceptance of
                any changes.
              </p>
            </section>

            <section>
              <h2>2. About ShowSales.pk</h2>
              <p>
                ShowSales.pk is Pakistan's premier sale discovery platform that
                aggregates and showcases sales, discounts, and promotional
                offers from various brands across the country. We connect
                customers with brands to facilitate purchases during sale
                events.
              </p>
              <p>
                ShowSales.pk acts as both a marketplace and a direct retailer.
                Some products are sold directly by ShowSales.pk, while others
                are facilitated through our brand partners.
              </p>
            </section>

            <section>
              <h2>3. User Accounts</h2>
              <h3>Account Registration</h3>
              <p>
                To access certain features, you may need to create an account.
                When registering, you agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3>Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account if you
                violate these Terms or engage in fraudulent or harmful
                activities.
              </p>
            </section>

            <section>
              <h2>4. Products and Pricing</h2>
              <h3>Product Information</h3>
              <p>
                We strive to provide accurate product descriptions, images, and
                pricing. However, we do not warrant that product descriptions or
                other content is accurate, complete, reliable, current, or
                error-free.
              </p>

              <h3>Pricing</h3>
              <ul>
                <li>All prices are displayed in Pakistani Rupees (PKR)</li>
                <li>Prices are subject to change without notice</li>
                <li>Sale prices are valid for the specified duration only</li>
                <li>We reserve the right to correct pricing errors</li>
              </ul>

              <h3>Availability</h3>
              <p>
                Product availability is subject to change. We reserve the right
                to limit quantities, refuse orders, or cancel orders at our
                discretion.
              </p>
            </section>

            <section>
              <h2>5. Orders and Payment</h2>
              <h3>Order Acceptance</h3>
              <p>
                Placing an order constitutes an offer to purchase. We reserve
                the right to accept or decline any order. Order confirmation
                does not guarantee acceptance until the order is shipped.
              </p>

              <h3>Payment Methods</h3>
              <p>We accept the following payment methods:</p>
              <ul>
                <li>Cash on Delivery (COD)</li>
                <li>Credit/Debit Cards (Visa, Mastercard)</li>
                <li>JazzCash</li>
                <li>EasyPaisa</li>
                <li>Bank Transfer</li>
              </ul>

              <h3>Payment Security</h3>
              <p>
                All online transactions are processed through secure payment
                gateways. We do not store your complete card information on our
                servers.
              </p>
            </section>

            <section>
              <h2>6. Shipping and Delivery</h2>
              <p>
                Please refer to our{" "}
                <Link href="/shipping-policy">Shipping Policy</Link> for
                detailed information about:
              </p>
              <ul>
                <li>Delivery timeframes</li>
                <li>Shipping charges</li>
                <li>Delivery areas</li>
                <li>Order tracking</li>
              </ul>
            </section>

            <section>
              <h2>7. Returns and Refunds</h2>
              <p>
                Please refer to our{" "}
                <Link href="/refund-policy">Return & Refund Policy</Link> for
                detailed information about:
              </p>
              <ul>
                <li>Return eligibility</li>
                <li>Refund process</li>
                <li>Exchange procedures</li>
                <li>Cancellation policy</li>
              </ul>
            </section>

            <section>
              <h2>8. Intellectual Property</h2>
              <p>
                All content on ShowSales.pk, including text, graphics, logos,
                images, and software, is the property of ShowSales.pk or its
                content suppliers and is protected by intellectual property
                laws.
              </p>
              <p>You may not:</p>
              <ul>
                <li>
                  Copy, modify, or distribute our content without permission
                </li>
                <li>Use our trademarks without authorization</li>
                <li>Scrape or extract data from our website</li>
                <li>Reverse engineer our website or services</li>
              </ul>
            </section>

            <section>
              <h2>9. User Conduct</h2>
              <p>When using our Service, you agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Provide false or misleading information</li>
                <li>Engage in fraudulent activities</li>
                <li>Interfere with the operation of our website</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post spam or unsolicited advertisements</li>
                <li>Upload malicious software or viruses</li>
              </ul>
            </section>

            <section>
              <h2>10. Reviews and User Content</h2>
              <p>
                By submitting reviews, comments, or other content, you grant
                ShowSales.pk a non-exclusive, royalty-free license to use,
                modify, and display such content.
              </p>
              <p>User content must not:</p>
              <ul>
                <li>Be false, misleading, or defamatory</li>
                <li>Infringe on third-party rights</li>
                <li>Contain offensive or inappropriate material</li>
                <li>Violate any laws</li>
              </ul>
              <p>
                We reserve the right to remove any user content at our
                discretion.
              </p>
            </section>

            <section>
              <h2>11. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, ShowSales.pk shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages arising from:
              </p>
              <ul>
                <li>Your use of or inability to use our Service</li>
                <li>Any errors or omissions in our content</li>
                <li>Unauthorized access to your data</li>
                <li>Actions of third parties</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount you paid for the
                product or service in question.
              </p>
            </section>

            <section>
              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify and hold ShowSales.pk, its officers,
                directors, employees, and agents harmless from any claims,
                damages, losses, or expenses arising from your use of the
                Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2>13. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the content, privacy practices, or terms of
                these external sites. Use them at your own risk.
              </p>
            </section>

            <section>
              <h2>14. Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or your use of our Service
                shall be:
              </p>
              <ul>
                <li>
                  First attempted to be resolved through mutual negotiation
                </li>
                <li>
                  Subject to the exclusive jurisdiction of the courts of Lahore,
                  Pakistan
                </li>
                <li>Governed by the laws of Pakistan</li>
              </ul>
            </section>

            <section>
              <h2>15. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions shall continue in full
                force and effect.
              </p>
            </section>

            <section>
              <h2>16. Contact Information</h2>
              <p>For questions about these Terms, please contact us:</p>
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
