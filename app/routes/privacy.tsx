import type { MetaFunction } from "@remix-run/node";

/**
 * Politique de confidentialité — page PUBLIQUE.
 *
 * Obligatoire pour la fiche App Store : Shopify exige une URL accessible sans
 * authentification. Elle vit donc dans une route à part, hors du layout `app.`
 * qui impose la session marchand.
 *
 * Le contenu décrit ce que l'app stocke RÉELLEMENT, vérifié dans le schéma
 * Prisma, dans les webhooks et dans le script du thème. Ne pas l'enjoliver :
 * c'est un engagement, et un examinateur le compare au comportement observé.
 */

const EMAIL = "clemenceau.ia@gmail.com";
const MAJ = "20 August 2026";

export const meta: MetaFunction = () => [
  { title: "Privacy — Popup Pop" },
  {
    name: "description",
    content:
      "What Popup Pop stores, what stays in the visitor's browser, where it is hosted, and how a merchant's data is deleted.",
  },
];

/* --- Charte visuelle ---------------------------------------------------- */
const C = {
  fond: "#F5F5F3",
  encre: "#17181C",
  texte: "#3D3E44",
  doux: "#85868D",
  trait: "rgba(23,24,28,.14)",
  carte: "rgba(255,255,255,.62)",
  ombre: "rgba(23,24,28,.05) 0 1px 2px, rgba(23,24,28,.06) 0 12px 32px",
  sans: '"DM Sans", -apple-system, system-ui, "Segoe UI", sans-serif',
  serif: "Fraunces, Georgia, serif",
};

function Surtitre({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: "1.61px",
        textTransform: "uppercase",
        color: C.doux,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: C.carte,
        border: `1px solid ${C.trait}`,
        borderRadius: 22,
        boxShadow: C.ombre,
        padding: "30px 32px",
        marginBottom: 18,
      }}
    >
      <h2
        style={{
          fontFamily: C.serif,
          fontWeight: 300,
          fontSize: 25,
          letterSpacing: "-.6px",
          color: C.encre,
          margin: "0 0 14px",
        }}
      >
        {titre}
      </h2>
      <div style={{ fontSize: 16, lineHeight: 1.68, color: C.texte }}>{children}</div>
    </section>
  );
}

export default function Privacy() {
  const lien = { color: C.encre, textDecoration: "underline", textUnderlineOffset: 3 };
  const liste = { margin: "12px 0 0", paddingLeft: 20 };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:opsz,wght@9..144,300&display=swap"
      />
      <main
        style={{
          background: C.fond,
          minHeight: "100vh",
          fontFamily: C.sans,
          color: C.texte,
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "34px 0 66px",
            fontFamily: C.serif,
            fontWeight: 300,
            fontSize: 21,
            letterSpacing: "-.4px",
            color: C.encre,
          }}
        >
          Popup Pop
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Surtitre>Privacy · Popup Pop</Surtitre>
          <h1
            style={{
              fontFamily: C.serif,
              fontWeight: 300,
              fontSize: 44,
              lineHeight: 1.02,
              letterSpacing: "-1.54px",
              color: C.encre,
              margin: "0 0 22px",
            }}
          >
            What Popup Pop stores,
            <br />
            and what it never does.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.62, color: C.doux, margin: "0 0 44px" }}>
            Popup Pop is a Shopify app that displays a popup on your storefront. It shows the
            message you wrote to whoever visits your store. It does not need to know anything
            about those people, and it is built so that it never does.
          </p>

          <Section titre="No customer data, at any point">
            <p>
              Popup Pop holds no personal data about your customers. No names, no email
              addresses, no orders, no browsing history, no IP addresses, no identifiers of any
              kind.
            </p>
            <p style={{ marginTop: 12 }}>
              This is not only a promise: the app <strong>requests no permission at all</strong>.
              Its list of access scopes is empty, so it is technically unable to read your
              products, your orders or your customers, whatever it might be asked to do. You can
              see this for yourself on the install screen, which lists nothing to approve.
            </p>
            <p style={{ marginTop: 12 }}>
              Popup Pop sets no cookie, runs no analytics, and counts no impressions. It does not
              know how many people saw your popup, and neither do we.
            </p>
          </Section>

          <Section titre="What stays in the visitor's browser">
            <p>
              So that the same popup is not shown twice to someone who has already closed it, the
              script writes a single entry to the visitor&rsquo;s <code>sessionStorage</code>,
              named <code>popup_pop_shown_…</code>. Its value is the digit 1.
            </p>
            <p style={{ marginTop: 12 }}>
              <code>sessionStorage</code> is erased by the browser as soon as the tab is closed.
              Nothing survives the visit, nothing identifies anyone, and nothing is ever sent to
              our servers.
            </p>
          </Section>

          <Section titre="What the app stores about your store">
            <ul style={liste}>
              <li>Your store domain, used to identify which settings belong to you.</li>
              <li>
                Your popup content: the title, the message, the button label and the promo code
                you write.
              </li>
              <li>
                Your design settings: gradient colors, text colors, type sizes, alignment, font
                and glass effect.
              </li>
              <li>Whether the popup is currently active.</li>
              <li>
                An access token issued by Shopify when you install the app. It is what identifies
                your store, and it stops working when you uninstall.
              </li>
            </ul>
            <p style={{ marginTop: 12 }}>
              All of it is content you wrote yourself. None of it describes a person.
            </p>
          </Section>

          <Section titre="Where it is hosted">
            <p>
              The application runs on Vercel and the database is hosted by Neon, both in the
              United States, in the AWS <code>us-east-1</code> region in Virginia. Traffic
              between your store, the app and the database is encrypted in transit. No data is
              transferred to any other processor, and Popup Pop sends nothing to third-party
              services.
            </p>
            <p style={{ marginTop: 12 }}>
              If you are in the European Union, the only data leaving it is the store data listed
              above — never anything belonging to your customers.
            </p>
          </Section>

          <Section titre="How long it is kept, and how it is deleted">
            <p>
              When you uninstall the app, Shopify notifies us and your session and popup settings
              are deleted from the database straight away. The access token stops working at the
              same moment, and the script is no longer served to your storefront.
            </p>
            <p style={{ marginTop: 12 }}>
              When Shopify asks us to erase a store — which it does after an uninstall, or on
              your request — everything belonging to that store is deleted. Popup Pop implements
              Shopify&rsquo;s mandatory compliance webhooks, including <code>shop/redact</code>,{" "}
              <code>customers/redact</code> and <code>customers/data_request</code>. The two
              customer requests return nothing, because there is nothing to return.
            </p>
          </Section>

          <Section titre="Your rights">
            <p>
              You may ask at any time what is stored about your store, request a copy, ask for it
              to be corrected, or ask for it to be erased. Write to{" "}
              <a href={`mailto:${EMAIL}`} style={lien}>
                {EMAIL}
              </a>{" "}
              and you will have an answer within thirty days, usually much sooner.
            </p>
            <p style={{ marginTop: 12 }}>
              If this policy changes in a way that affects you, the date below changes and the
              new version is published here before it takes effect.
            </p>
          </Section>

          <Section titre="Contact">
            <p>
              Questions about this policy, or about the data held for your store:{" "}
              <a href={`mailto:${EMAIL}`} style={lien}>
                {EMAIL}
              </a>
            </p>
          </Section>

          <p style={{ fontSize: 13, color: C.doux, marginTop: 30, letterSpacing: ".2px" }}>
            Last updated {MAJ}
          </p>
        </div>
      </main>
    </>
  );
}
