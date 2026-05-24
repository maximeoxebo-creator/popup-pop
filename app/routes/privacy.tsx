export default function Privacy() {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 24px",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#1a1a1a",
      lineHeight: "1.7",
    }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>
        Last updated: May 22, 2026
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          1. Introduction
        </h2>
        <p>
          Popup Pop ("we", "our", or "us") is a Shopify application that allows
          merchants to display customizable popups on their online store. This
          Privacy Policy explains how we collect, use, and protect information
          when you use our app.
        </p>
        <p style={{ marginTop: "12px" }}>
          For any questions regarding this policy, please contact us at:{" "}
          <a href="mailto:clemenceau.ia@gmail.com" style={{ color: "#667eea" }}>
            clemenceau.ia@gmail.com
          </a>
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          2. Information We Collect
        </h2>
        <p>When you install Popup Pop, we collect and store:</p>
        <ul style={{ paddingLeft: "24px", marginTop: "12px" }}>
          <li>Your Shopify store domain</li>
          <li>Your Shopify access token (to authenticate API requests)</li>
          <li>Popup settings you configure (title, message, active status)</li>
        </ul>
        <p style={{ marginTop: "12px" }}>
          We do <strong>not</strong> collect any data about your store's customers
          or visitors.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          3. How We Use Your Information
        </h2>
        <p>We use the collected information solely to:</p>
        <ul style={{ paddingLeft: "24px", marginTop: "12px" }}>
          <li>Authenticate your store with our application</li>
          <li>Save and retrieve your popup configuration</li>
          <li>Display your popup on your storefront</li>
        </ul>
        <p style={{ marginTop: "12px" }}>
          We do not sell, trade, or share your data with third parties.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          4. Data Storage
        </h2>
        <p>
          Your data is stored securely in a PostgreSQL database hosted on{" "}
          <a href="https://neon.tech" style={{ color: "#667eea" }}>Neon</a> and
          served through{" "}
          <a href="https://vercel.com" style={{ color: "#667eea" }}>Vercel</a>.
          Both providers comply with industry-standard security practices.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          5. Data Retention
        </h2>
        <p>
          We retain your data for as long as you have Popup Pop installed on your
          store. When you uninstall the app, all your data is automatically
          deleted from our database within 48 hours.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          6. Your Rights
        </h2>
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: "24px", marginTop: "12px" }}>
          <li>Access the data we hold about your store</li>
          <li>Request deletion of your data at any time</li>
          <li>Uninstall the app to stop all data processing</li>
        </ul>
        <p style={{ marginTop: "12px" }}>
          To exercise these rights, contact us at{" "}
          <a href="mailto:clemenceau.ia@gmail.com" style={{ color: "#667eea" }}>
            clemenceau.ia@gmail.com
          </a>
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by updating the "Last updated" date at the top of this
          page.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
          8. Contact
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <p style={{ marginTop: "12px" }}>
          <strong>Email:</strong>{" "}
          <a href="mailto:clemenceau.ia@gmail.com" style={{ color: "#667eea" }}>
            clemenceau.ia@gmail.com
          </a>
          <br />
          <strong>App:</strong> Popup Pop
          <br />
          <strong>Website:</strong>{" "}
          <a href="https://popup-pop.vercel.app" style={{ color: "#667eea" }}>
            https://popup-pop.vercel.app
          </a>
        </p>
      </section>
    </div>
  );
}
