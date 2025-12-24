import Link from "next/link";
import "@/app/styles/policy.css";

export const metadata = {
  title: "Return & Refund Policy | ShowSales.pk",
  description:
    "Return and Refund Policy for ShowSales.pk - Pakistan's leading sale discovery platform",
};

export default function RefundPolicyPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Return & Refund Policy</h1>
          <p>Last updated: December 24, 2024</p>
        </div>
      </section>

      <div className="policy-page">
        <div className="container">
          <div className="policy-content">
            <section>
              <h2>1. Overview</h2>
              <p>
                At ShowSales.pk, we want you to be completely satisfied with
                your purchase. This Return & Refund Policy outlines the terms
                and conditions for returns, exchanges, and refunds for products
                purchased through our platform.
              </p>
              <p>
                Please note that ShowSales.pk acts as a marketplace connecting
                customers with various brands. Return and refund policies may
                vary slightly depending on the brand. The terms below represent
                our standard policy.
              </p>
            </section>

            <section>
              <h2>2. Return Eligibility</h2>
              <p>
                To be eligible for a return, your item must meet the following
                criteria:
              </p>
              <ul>
                <li>
                  Return request must be initiated within{" "}
                  <strong>7 days</strong> of delivery
                </li>
                <li>
                  Item must be unused, unworn, and in its original condition
                </li>
                <li>
                  Item must be in original packaging with all tags attached
                </li>
                <li>
                  Item must not be a final sale or clearance item (unless
                  defective)
                </li>
                <li>Receipt or proof of purchase is required</li>
              </ul>

              <h3>Non-Returnable Items</h3>
              <p>The following items cannot be returned:</p>
              <ul>
                <li>Undergarments and intimate apparel</li>
                <li>Swimwear</li>
                <li>Cosmetics and personal care products (if opened)</li>
                <li>Customized or personalized items</li>
                <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                <li>Gift cards</li>
              </ul>
            </section>

            <section>
              <h2>3. Return Process</h2>
              <p>To initiate a return, please follow these steps:</p>
              <ol>
                <li>
                  <strong>Contact Us:</strong> Email us at
                  ahmadnabeel634@gmail.com or call +92 309 0761071 within 7 days
                  of receiving your order.
                </li>
                <li>
                  <strong>Provide Details:</strong> Include your order number,
                  item(s) to be returned, and reason for return.
                </li>
                <li>
                  <strong>Receive Authorization:</strong> Our team will review
                  your request and provide a Return Authorization Number (RAN)
                  within 24-48 hours.
                </li>
                <li>
                  <strong>Pack the Item:</strong> Securely pack the item in its
                  original packaging with all tags attached.
                </li>
                <li>
                  <strong>Ship the Item:</strong> Send the package to our return
                  address. Keep the tracking number for your records.
                </li>
              </ol>

              <div className="info-box">
                <strong>Return Address:</strong>
                <br />
                ShowSales.pk Returns Department
                <br />
                190 B Sector C, Jasmine Block
                <br />
                Bahria Town, Lahore, Pakistan
              </div>
            </section>

            <section>
              <h2>4. Refund Process</h2>
              <p>Once we receive and inspect your returned item:</p>
              <ul>
                <li>
                  We will notify you via email about the status of your refund
                </li>
                <li>
                  If approved, the refund will be processed within{" "}
                  <strong>5-7 business days</strong>
                </li>
                <li>Refund will be credited to your original payment method</li>
              </ul>

              <h3>Refund Timeline by Payment Method</h3>
              <table className="refund-table">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Refund Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Credit/Debit Card</td>
                    <td>5-10 business days</td>
                  </tr>
                  <tr>
                    <td>JazzCash</td>
                    <td>3-5 business days</td>
                  </tr>
                  <tr>
                    <td>EasyPaisa</td>
                    <td>3-5 business days</td>
                  </tr>
                  <tr>
                    <td>Bank Transfer</td>
                    <td>5-7 business days</td>
                  </tr>
                  <tr>
                    <td>Cash on Delivery</td>
                    <td>7-10 business days (via bank transfer)</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2>5. Exchanges</h2>
              <p>
                We offer exchanges for items of equal or greater value. If you
                wish to exchange an item for a different size, color, or
                product:
              </p>
              <ul>
                <li>Contact us within 7 days of delivery</li>
                <li>The new item must be of equal or greater value</li>
                <li>
                  If the new item costs more, you will need to pay the
                  difference
                </li>
                <li>
                  If the new item costs less, we will refund the difference
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Defective or Damaged Items</h2>
              <p>
                If you receive a defective or damaged item, please contact us
                immediately within <strong>48 hours</strong> of delivery:
              </p>
              <ul>
                <li>Take clear photos of the defect or damage</li>
                <li>
                  Email us at returns@showsales.pk with your order number and
                  photos
                </li>
                <li>
                  We will arrange a free pickup or provide a prepaid return
                  label
                </li>
                <li>
                  You will receive a full refund or replacement at no additional
                  cost
                </li>
              </ul>
            </section>

            <section>
              <h2>7. Wrong Item Received</h2>
              <p>
                If you receive an incorrect item, please contact us within{" "}
                <strong>48 hours</strong> with:
              </p>
              <ul>
                <li>Your order number</li>
                <li>Photo of the item received</li>
                <li>Description of the item you ordered</li>
              </ul>
              <p>
                We will arrange a free pickup and send you the correct item at
                no additional cost.
              </p>
            </section>

            <section>
              <h2>8. Return Shipping Costs</h2>
              <ul>
                <li>
                  <strong>Standard Returns:</strong> Customer is responsible for
                  return shipping costs
                </li>
                <li>
                  <strong>Defective/Damaged Items:</strong> ShowSales.pk covers
                  return shipping
                </li>
                <li>
                  <strong>Wrong Item Sent:</strong> ShowSales.pk covers return
                  shipping
                </li>
              </ul>
              <p>
                We recommend using a trackable shipping service for all returns.
              </p>
            </section>

            <section>
              <h2>9. Cancellations</h2>
              <p>
                Orders can be cancelled free of charge if the cancellation
                request is made before the order is shipped. Once shipped, the
                standard return policy applies.
              </p>
              <ul>
                <li>
                  To cancel an order, contact us immediately at
                  orders@showsales.pk
                </li>
                <li>Include your order number in the cancellation request</li>
                <li>
                  Cancellation refunds are processed within 3-5 business days
                </li>
              </ul>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                For any questions about returns or refunds, please contact us:
              </p>
              <div className="contact-box">
                <p>
                  <strong>ShowSales.pk Returns Department</strong>
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
