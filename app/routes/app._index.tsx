import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { Page, Layout, Card, TextField, Button, Banner, BlockStack, Text, Badge, InlineStack, Divider } from "@shopify/polaris";
import { authenticate, MONTHLY_PLAN } from "~/shopify.server";
import prisma from "~/db.server";
import { useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;
  let hasActivePayment = true;
  try {
    const billingCheck = await billing.check({ plans: [MONTHLY_PLAN], isTest: true });
    hasActivePayment = billingCheck.hasActivePayment;
    if (!hasActivePayment) {
      await billing.request({ plan: MONTHLY_PLAN, isTest: true, returnUrl: `${process.env.SHOPIFY_APP_URL}/app` });
    }
  } catch (error) {
    console.error("Billing check error:", error);
    hasActivePayment = true;
  }
  let settings = await prisma.popupSettings.findUnique({ where: { shop } });
  if (!settings) settings = await prisma.popupSettings.create({ data: { shop } });
  return json({ settings, hasActivePayment });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  await prisma.popupSettings.upsert({
    where: { shop },
    update: { title: formData.get("title") as string, message: formData.get("message") as string, isActive: formData.get("isActive") === "true" },
    create: { shop, title: formData.get("title") as string, message: formData.get("message") as string, isActive: formData.get("isActive") === "true" },
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
  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("isActive", String(isActive));
    submit(formData, { method: "post" });
  }, [title, message, isActive, submit]);
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
              <TextField label="Popup title" value={title} onChange={setTitle} autoComplete="off" placeholder="Welcome to our store!" />
              <TextField label="Popup message" value={message} onChange={setMessage} multiline={3} autoComplete="off" placeholder="Get 10% off your first order. Use code WELCOME10" />
              <InlineStack gap="300">
                <Button variant={isActive ? "secondary" : "primary"} tone={isActive ? "critical" : undefined} onClick={() => setIsActive(!isActive)}>{isActive ? "Disable popup" : "Enable popup"}</Button>
                <Button variant="primary" loading={isSaving} onClick={handleSave}>Save</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
