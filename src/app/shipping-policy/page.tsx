import Link from "next/link";
import "@/app/styles/policy.css";

export const metadata = {
  title: "Shipping Policy | ShowSales.pk",
  description:
    "Shipping and Delivery Policy for ShowSales.pk - Pakistan's leading sale discovery platform",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Shipping & Delivery Policy</h1>
          <p>Last updated: December 24, 2024</p>
        </div>
      </section>

      <div className="policy-page">
        <div className="container">
          <div className="policy-content">
            <section>
              <h2>1. Shipping Coverage</h2>
              <p>
                ShowSales.pk delivers across Pakistan. We partner with leading
                courier services to ensure your orders reach you safely and on
                time.
              </p>
              <h3>Delivery Areas</h3>
              <ul>
                <li>
                  <strong>Major Cities:</strong> Karachi, Lahore, Islamabad,
                  Rawalpindi, Faisalabad, Multan, Peshawar, Quetta
                </li>
                <li>
                  <strong>Other Cities:</strong> All major cities and towns
                  across Pakistan
                </li>
                <li>
                  <strong>Remote Areas:</strong> May require additional delivery
                  time
                </li>
              </ul>
            </section>

            <section>
              <h2>2. Shipping Charges</h2>
              <table className="shipping-table">
                <thead>
                  <tr>
                    <th>Order Value</th>
                    <th>Shipping Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Above Rs. 3,000</td>
                    <td>
                      <strong>FREE Shipping</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Rs. 1,000 - Rs. 2,999</td>
                    <td>Rs. 150</td>
                  </tr>
                  <tr>
                    <td>Below Rs. 1,000</td>
                    <td>Rs. 200</td>
                  </tr>
                </tbody>
              </table>
              <p className="note">
                * Shipping charges may vary for remote areas and heavy items.
              </p>
            </section>

            <section>
              <h2>3. Delivery Time</h2>
              <table className="shipping-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Standard Delivery</th>
                    <th>Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lahore, Karachi, Islamabad</td>
                    <td>2-3 business days</td>
                    <td>1-2 business days</td>
                  </tr>
                  <tr>
                    <td>Other Major Cities</td>
                    <td>3-5 business days</td>
                    <td>2-3 business days</td>
                  </tr>
                  <tr>
                    <td>Remote Areas</td>
                    <td>5-7 business days</td>
                    <td>3-5 business days</td>
                  </tr>
                </tbody>
              </table>
              <p className="note">
                * Delivery times are estimates and may vary during peak sale
                seasons, holidays, or unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2>4. Order Processing</h2>
              <ul>
                <li>
                  Orders are processed within <strong>24-48 hours</strong>{" "}
                  (business days)
                </li>
                <li>
                  Orders placed after 4:00 PM will be processed the next
                  business day
                </li>
                <li>
                  Orders placed on weekends or public holidays will be processed
                  on the next business day
                </li>
                <li>
                  You will receive an email/SMS confirmation once your order is
                  shipped
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Order Tracking</h2>
              <p>
                Once your order is shipped, you will receive a tracking number
                via email and SMS. You can track your order:
              </p>
              <ul>
                <li>
                  Through the courier's website using your tracking number
                </li>
                <li>By logging into your ShowSales.pk account</li>
                <li>By contacting our customer support</li>
              </ul>
            </section>

            <section>
              <h2>6. Delivery Process</h2>
              <ul>
                <li>
                  Our courier partner will attempt delivery at the address
                  provided
                </li>
                <li>Someone must be available to receive the package</li>
                <li>
                  Please ensure your phone number is correct for delivery
                  coordination
                </li>
                <li>Our courier may call before delivery for confirmation</li>
              </ul>

              <h3>Failed Delivery Attempts</h3>
              <p>If delivery is unsuccessful:</p>
              <ul>
                <li>The courier will make up to 3 delivery attempts</li>
                <li>
                  After 3 failed attempts, the package will be returned to us
                </li>
                <li>Re-delivery charges may apply for returned packages</li>
              </ul>
            </section>

            <section>
              <h2>7. Cash on Delivery (COD)</h2>
              <p>We offer Cash on Delivery across Pakistan. Please note:</p>
              <ul>
                <li>COD is available for orders up to Rs. 50,000</li>
                <li>Please have the exact amount ready for the courier</li>
                <li>The courier may not have change for large amounts</li>
                <li>COD orders may take an additional 1-2 days to process</li>
              </ul>
            </section>

            <section>
              <h2>8. Packaging</h2>
              <p>All orders are carefully packaged to ensure safe delivery:</p>
              <ul>
                <li>Products are packed in protective materials</li>
                <li>Fragile items receive extra padding</li>
                <li>Original product packaging is preserved when possible</li>
                <li>All packages are sealed for security</li>
              </ul>
            </section>

            <section>
              <h2>9. Damaged or Missing Packages</h2>
              <p>If your package arrives damaged or items are missing:</p>
              <ul>
                <li>Do not accept visibly damaged packages</li>
                <li>
                  If damage is discovered after opening, take photos immediately
                </li>
                <li>
                  Contact us within 48 hours with your order number and photos
                </li>
                <li>We will arrange a replacement or refund</li>
              </ul>
            </section>

            <section>
              <h2>10. Special Circumstances</h2>
              <h3>Peak Sale Seasons</h3>
              <p>
                During major sales (Eid, Independence Day, Black Friday, etc.),
                delivery times may be extended by 2-3 additional days due to
                high order volumes.
              </p>

              <h3>Weather & Natural Events</h3>
              <p>
                Delivery may be delayed due to extreme weather conditions,
                natural disasters, or other circumstances beyond our control. We
                will notify you of any significant delays.
              </p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>For shipping-related queries, please contact us:</p>
              <div className="contact-box">
                <p>
                  <strong>ShowSales.pk Shipping Support</strong>
                </p>
                <p>Email: ahmadnabeel634@gmail.com</p>
                <p>Phone/WhatsApp: +92 309 0761071</p>
                <p>Hours: Monday - Saturday, 10:00 AM - 7:00 PM</p>
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
