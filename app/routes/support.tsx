export default function Support() {
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
        Support
      </h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>
        We're here to help you get the most out of Popup Pop.
      </p>

      <section style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        padding: "32px",
        color: "#fff",
        marginBottom: "40px",
      }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
          Contact Us
        </h2>
        <p style={{ opacity: 0.9, marginBottom: "20px" }}>
          Have a question or issue? Send us an email and we'll get back to you
          within 24 hours.
        </p>
        <a
          href="mailto:clemenceau.ia@gmail.com"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#667eea",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          clemenceau.ia@gmail.com
        </a>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>
          Frequently Asked Questions
        </h2>

        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>
            How do I activate the popup on my store?
          </h3>
          <p style={{ color: "#555" }}>
            Go to <strong>Online Store → Themes → Customize</strong>, then add
            the <strong>"Popup Pop"</strong> block to your theme and click Save.
          </p>
        </div>

        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>
            How do I change the popup message?
          </h3>
          <p style={{ color: "#555" }}>
            Open the Popup Pop app from your Shopify admin, update the title and
            message fields, then click <strong>Save</strong>.
          </p>
        </div>

        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>
            How do I disable the popup temporarily?
          </h3>
          <p style={{ color: "#555" }}>
            In the app dashboard, click the <strong>Désactiver</strong> button.
            Your settings are saved and you can re-enable it at any time.
          </p>
        </div>

        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>
            The popup is not showing on my store. What should I do?
          </h3>
          <p style={{ color: "#555" }}>
            Make sure the popup is set to <strong>Active</strong> in the app
            dashboard, and that the Popup Pop block is added and enabled in your
            theme customizer. If the issue persists, contact us.
          </p>
        </div>

        <div style={{ paddingBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>
            How do I uninstall the app?
          </h3>
          <p style={{ color: "#555" }}>
            Go to <strong>Settings → Apps and sales channels</strong> in your
            Shopify admin, find Popup Pop, and click <strong>Delete</strong>. All
            your data will be removed within 48 hours.
          </p>
        </div>
      </section>

      <section style={{
        background: "#f8f8f8",
        borderRadius: "12px",
        padding: "24px",
        textAlign: "center" as const,
      }}>
        <p style={{ color: "#555", marginBottom: "8px" }}>
          Still need help? We respond within 24 hours.
        </p>
        <a
          href="mailto:clemenceau.ia@gmail.com"
          style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}
        >
          clemenceau.ia@gmail.com
        </a>
      </section>
    </div>
  );
}
