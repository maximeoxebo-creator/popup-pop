import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page, Layout, Card, TextField, Button, Banner,
  BlockStack, Text, Badge, InlineStack, Divider, Select,
} from "@shopify/polaris";
import { authenticate, MONTHLY_PLAN } from "~/shopify.server";
import prisma from "~/db.server";
import { useState, useCallback } from "react";

const COLOR_OPTIONS_START = [
  { label: "Purple Blue", value: "#667eea" },
  { label: "Pink", value: "#f093fb" },
  { label: "Sky Blue", value: "#4facfe" },
  { label: "Green", value: "#43e97b" },
  { label: "Rose", value: "#fa709a" },
  { label: "Orange", value: "#f7971e" },
  { label: "Black", value: "#000000" },
  { label: "Dark Navy", value: "#1a1a2e" },
];

const COLOR_OPTIONS_END = [
  { label: "Deep Purple", value: "#764ba2" },
  { label: "Coral Red", value: "#f5576c" },
  { label: "Cyan", value: "#00f2fe" },
  { label: "Teal", value: "#38f9d7" },
  { label: "Hot Pink", value: "#ee0979" },
  { label: "Warm Red", value: "#ff512f" },
  { label: "Dark Grey", value: "#434343" },
  { label: "Midnight Blue", value: "#16213e" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  // isTest: true sur les boutiques dev (reviewers Shopify inclus), false en production
  const isTest = process.env.NODE_ENV !== "production";

  try {
    const billingCheck = await billing.check({
      plans: [MONTHLY_PLAN],
      isTest,
    });

    if (!billingCheck.hasActivePayment) {
      const paymentResponse = await billing.request({
        plan: MONTHLY_PLAN,
        isTest,
        returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
      });
      return redirect(paymentResponse.confirmationUrl);
    }
  } catch (error) {
    // En cas d'erreur billing, on continue sans bloquer l'accès
    console.error("Billing check error:", error);
  }

  let settings = await prisma.popupSettings.findUnique({ where: { shop } });
  if (!settings) settings = await prisma.popupSettings.create({ data: { shop } });

  return json({ settings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  await prisma.popupSettings.upsert({
    where: { shop },
    update: {
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      isActive: formData.get("isActive") === "true",
      colorStart: formData.get("colorStart") as string,
      colorEnd: formData.get("colorEnd") as string,
    },
    create: {
      shop,
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      isActive: formData.get("isActive") === "true",
      colorStart: formData.get("colorStart") as string,
      colorEnd: formData.get("colorEnd") as string,
    },
  });

  return json({ success: true });
};

export default function Index() {
  const { settings } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const [title, setTitle] = useState(settings.title);
  const [message, setMessage] = useState(settings.message);
  const [isActive, setIsActive] = useState(settings.isActive);
  const [colorStart, setColorStart] = useState(settings.colorStart ?? "#667eea");
  const [colorEnd, setColorEnd] = useState(settings.colorEnd ?? "#764ba2");

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("isActive", String(isActive));
    formData.append("colorStart", colorStart);
    formData.append("colorEnd", colorEnd);
    submit(formData, { method: "post" });
  }, [title, message, isActive, colorStart, colorEnd, submit]);

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`,
    borderRadius: "8px",
    height: "40px",
    marginTop: "8px",
  };

  return (
    <Page title="Popup Pop">
      <Layout>
        <Layout.Section>
          <Banner title="How to activate your popup?" tone="info">
            <p>Go to <strong>Online Store → Themes → Customize</strong>, then add the <strong>"Popup Pop"</strong> block to your theme.</p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h2">Popup Settings</Text>
                <Badge tone={isActive ? "success" : "critical"}>{isActive ? "Active" : "Inactive"}</Badge>
              </InlineStack>
              <Divider />

              <TextField
                label="Popup title"
                value={title}
                onChange={setTitle}
                autoComplete="off"
                placeholder="Welcome to our store!"
              />
              <TextField
                label="Popup message"
                value={message}
                onChange={setMessage}
                multiline={3}
                autoComplete="off"
                placeholder="Get 10% off your first order. Use code WELCOME10"
              />

              <Divider />
              <Text variant="headingMd" as="h3">Gradient Colors</Text>

              <InlineStack gap="400" blockAlign="end">
                <div style={{ flex: 1 }}>
                  <Select
                    label="Start color"
                    options={COLOR_OPTIONS_START}
                    value={colorStart}
                    onChange={setColorStart}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Select
                    label="End color"
                    options={COLOR_OPTIONS_END}
                    value={colorEnd}
                    onChange={setColorEnd}
                  />
                </div>
              </InlineStack>

              <div>
                <Text as="p" tone="subdued">Preview</Text>
                <div style={gradientStyle} />
              </div>

              <Divider />
              <InlineStack gap="300">
                <Button
                  variant={isActive ? "secondary" : "primary"}
                  tone={isActive ? "critical" : undefined}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "Disable popup" : "Enable popup"}
                </Button>
                <Button variant="primary" loading={isSaving} onClick={handleSave}>
                  Save
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
