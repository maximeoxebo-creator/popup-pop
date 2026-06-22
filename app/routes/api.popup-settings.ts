import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "~/db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
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
    active:       true,
    title:        settings.title,
    message:      settings.message,
    buttonText:   settings.buttonText,
    textAlign:    settings.textAlign,
    titleSize:    settings.titleSize,
    messageSize:  settings.messageSize,
    titleColor:   settings.titleColor,
    messageColor: settings.messageColor,
    fontFamily:   settings.fontFamily,
    liquidGlass:      settings.liquidGlass,
    glassGradient:    (settings as any).glassGradient ?? false,
    colorStart:       settings.colorStart,
    colorEnd:         settings.colorEnd,
    buttonTextColor:  settings.buttonTextColor,
  }, { headers: corsHeaders });
};
