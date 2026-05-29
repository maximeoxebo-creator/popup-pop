import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session } = await authenticate.webhook(request);

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
        await db.popupSettings.deleteMany({ where: { shop } });
      }
      break;

    // Webhooks RGPD obligatoires Shopify
    case "CUSTOMERS_DATA_REQUEST":
      // Le marchand demande les données d'un client
      // Popup Pop ne stocke pas de données clients — rien à faire
      break;

    case "CUSTOMERS_REDACT":
      // Le marchand demande la suppression des données d'un client
      // Popup Pop ne stocke pas de données clients — rien à faire
      break;

    case "SHOP_REDACT":
      // Suppression complète des données de la boutique (48h après désinstallation)
      await db.popupSettings.deleteMany({ where: { shop } });
      break;

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
