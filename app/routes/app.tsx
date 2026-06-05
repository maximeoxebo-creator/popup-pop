import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import shopify from "~/shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await shopify.authenticate.admin(request);
  
  const shopHandle = session.shop.replace('.myshopify.com', '');
  const url = new URL(request.url);
  
  // Si le marchand revient de la page de pricing avec un plan sélectionné
  const chargeId = url.searchParams.get('charge_id');
  const planHandle = url.searchParams.get('plan');
  
  // Si aucun plan actif détecté, rediriger vers la page de pricing Shopify
  if (!chargeId && !planHandle) {
    return redirect(
      `https://admin.shopify.com/store/${shopHandle}/charges/popup-pop/pricing_plans`
    );
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
