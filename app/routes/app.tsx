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
  const { billing, session } = await shopify.authenticate.admin(request);

  // Vérifier si le marchand a une subscription active
  const billingCheck = await billing.require({
    plans: [MONTHLY_PLAN],
    isTest: true, // Mettre false en production live
    onFailure: async () => billing.request({
      plan: MONTHLY_PLAN,
      isTest: true, // Mettre false en production live
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
    }),
  });

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
