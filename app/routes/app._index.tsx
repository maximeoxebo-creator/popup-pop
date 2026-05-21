import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Banner,
  BlockStack,
  Text,
  Badge,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.popupSettings.findUnique({ where: { shop } });

  if (!settings) {
    settings = await prisma.popupSettings.create({ data: { shop } });
  }

  return json({ settings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const isActive = formData.get("isActive") === "true";

  await prisma.popupSettings.upsert({
    where: { shop },
    update: { title, message, isActive },
    create: { shop, title, message, isActive },
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
          <Banner title="Comment activer le popup ?" tone="info">
            <p>
              Allez dans <strong>Boutique en ligne → Thèmes → Personnaliser</strong>,
              puis ajoutez le bloc <strong>"Popup Pop"</strong> à votre thème.
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h2">Paramètres du Popup</Text>
                <Badge tone={isActive ? "success" : "critical"}>
                  {isActive ? "Actif" : "Inactif"}
                </Badge>
              </InlineStack>

              <Divider />

              <TextField
                label="Titre du popup"
                value={title}
                onChange={setTitle}
                autoComplete="off"
                placeholder="Welcome to our store!"
              />

              <TextField
                label="Message du popup"
                value={message}
                onChange={setMessage}
                multiline={3}
                autoComplete="off"
                placeholder="Get 10% off your first order. Use code WELCOME10"
              />

              <InlineStack gap="300">
                <Button
                  variant={isActive ? "secondary" : "primary"}
                  tone={isActive ? "critical" : undefined}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "Désactiver" : "Activer le popup"}
                </Button>

                <Button variant="primary" loading={isSaving} onClick={handleSave}>
                  Enregistrer
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
