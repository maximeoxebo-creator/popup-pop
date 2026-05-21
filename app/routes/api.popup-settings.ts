import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) return json({ error: "Shop required" }, { status: 400 });

  const settings = await prisma.popupSettings.findUnique({ where: { shop } });

  if (!settings || !settings.isActive) return json({ active: false });

  return json({ active: true, title: settings.title, message: settings.message });
};
