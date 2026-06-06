import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import shopify from "~/shopify.server";
import prisma from "~/db.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, redirect } = await shopify.authenticate.admin(request);

  const shop = session.shop;
  const shopHandle = shop.replace('.myshopify.com', '');
  const appHandle = 'popup-pop';

  // Vérifier si le marchand a déjà des settings en DB
  // Si non → première visite → rediriger vers la page de pricing
  const settings = await prisma.popupSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    return redirect(
      `https://admin.shopify.com/store/${shopHandle}/charges/${appHandle}/pricing_plans`,
      { target: "_top" }
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
