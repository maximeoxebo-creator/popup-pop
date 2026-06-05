import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import shopify, { MONTHLY_PLAN } from "~/shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session, redirect } = await shopify.authenticate.admin(request);

  const shopHandle = session.shop.replace('.myshopify.com', '');
  const appHandle = 'popup-pop';

  try {
    const { hasActivePayment } = await billing.check({
      plans: [MONTHLY_PLAN],
      isTest: true,
    });

    if (!hasActivePayment) {
      return redirect(
        `https://admin.shopify.com/store/${shopHandle}/charges/${appHandle}/pricing_plans`,
        { target: "_top" }
      );
    }
  } catch (error) {
    // Si billing.check échoue (ex: boutique de dev), on laisse passer
    console.error("Billing check error:", error);
  }

  const apiKey = process.env.SHOPIFY_API_KEY || "";
  return json({ apiKey });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app">Accueil</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = boundary.headers;
