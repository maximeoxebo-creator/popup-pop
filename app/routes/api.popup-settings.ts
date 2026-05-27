import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "~/db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json({ error: "Shop required" }, { status: 400, headers: corsHeaders });
  }

  const settings = await prisma.popupSettings.findUnique({ where: { shop } });

  if (!settings || !settings.isActive) {
    return json({ active: false }, { headers: corsHeaders });
  }

  return json({
    active: true,
    title: settings.title,
    message: settings.message,
    colorStart: settings.colorStart,
    colorEnd: settings.colorEnd,
  }, { headers: corsHeaders });
};
