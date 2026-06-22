import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page, Layout, Card, TextField, Button, Banner,
  BlockStack, Text, Badge, InlineStack, Divider, Select, RangeSlider, Checkbox,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { useState, useCallback } from "react";

const TEXT_ALIGN_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const FONT_OPTIONS = [
  { label: "Theme default", value: "inherit" },
  { label: "Sans-serif", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
];

function isValidHex(value: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function ColorField({
  label,
  value,
  onChange,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helpText?: string;
}) {
  const valid = isValidHex(value);
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      autoComplete="off"
      helpText={helpText}
      error={!valid ? "Enter a valid HEX color (e.g. #ffffff)" : undefined}
      prefix={
        valid ? (
          <span style={{
            display: "inline-block", width: 16, height: 16,
            borderRadius: 3, background: value,
            border: "1px solid #ccc", verticalAlign: "middle",
          }} />
        ) : undefined
      }
    />
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
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
      title:        formData.get("title") as string,
      message:      formData.get("message") as string,
      buttonText:   formData.get("buttonText") as string,
      textAlign:    formData.get("textAlign") as string,
      titleSize:    formData.get("titleSize") as string,
      messageSize:  formData.get("messageSize") as string,
      titleColor:   formData.get("titleColor") as string,
      messageColor: formData.get("messageColor") as string,
      fontFamily:   formData.get("fontFamily") as string,
      liquidGlass:      formData.get("liquidGlass") === "true",
      isActive:         formData.get("isActive") === "true",
      colorStart:       formData.get("colorStart") as string,
      colorEnd:         formData.get("colorEnd") as string,
      buttonTextColor:  formData.get("buttonTextColor") as string,
    },
    create: {
      shop,
      title:            formData.get("title") as string,
      message:          formData.get("message") as string,
      buttonText:       formData.get("buttonText") as string,
      textAlign:        formData.get("textAlign") as string,
      titleSize:        formData.get("titleSize") as string,
      messageSize:      formData.get("messageSize") as string,
      titleColor:       formData.get("titleColor") as string,
      messageColor:     formData.get("messageColor") as string,
      fontFamily:       formData.get("fontFamily") as string,
      liquidGlass:      formData.get("liquidGlass") === "true",
      isActive:         formData.get("isActive") === "true",
      colorStart:       formData.get("colorStart") as string,
      colorEnd:         formData.get("colorEnd") as string,
      buttonTextColor:  formData.get("buttonTextColor") as string,
    },
  });

  return json({ success: true });
};

export default function Index() {
  const { settings } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const [title, setTitle]               = useState(settings.title);
  const [message, setMessage]           = useState(settings.message);
  const [buttonText, setButtonText]     = useState(settings.buttonText ?? "Shop Now!");
  const [textAlign, setTextAlign]       = useState(settings.textAlign ?? "left");
  const [titleSize, setTitleSize]       = useState(Number(settings.titleSize ?? 22));
  const [messageSize, setMessageSize]   = useState(Number(settings.messageSize ?? 16));
  const [titleColor, setTitleColor]     = useState(settings.titleColor ?? "#ffffff");
  const [messageColor, setMessageColor] = useState(settings.messageColor ?? "#4a5568");
  const [fontFamily, setFontFamily]     = useState(settings.fontFamily ?? "inherit");
  const [liquidGlass, setLiquidGlass]   = useState(settings.liquidGlass ?? false);
  const [isActive, setIsActive]         = useState(settings.isActive);
  const [colorStart, setColorStart]           = useState(settings.colorStart ?? "#667eea");
  const [colorEnd, setColorEnd]               = useState(settings.colorEnd ?? "#764ba2");
  const [buttonTextColor, setButtonTextColor] = useState(settings.buttonTextColor ?? "#ffffff");

  const colorStartValid     = isValidHex(colorStart);
  const colorEndValid       = isValidHex(colorEnd);
  const titleColorValid     = isValidHex(titleColor);
  const msgColorValid       = isValidHex(messageColor);
  const btnTextColorValid   = isValidHex(buttonTextColor);
  const allValid = colorStartValid && colorEndValid && titleColorValid && msgColorValid && btnTextColorValid;

  const handleSave = useCallback(() => {
    if (!allValid) return;
    const formData = new FormData();
    formData.append("title",        title);
    formData.append("message",      message);
    formData.append("buttonText",   buttonText);
    formData.append("textAlign",    textAlign);
    formData.append("titleSize",    String(titleSize));
    formData.append("messageSize",  String(messageSize));
    formData.append("titleColor",   titleColor);
    formData.append("messageColor", messageColor);
    formData.append("fontFamily",   fontFamily);
    formData.append("liquidGlass",      String(liquidGlass));
    formData.append("isActive",         String(isActive));
    formData.append("colorStart",       colorStart);
    formData.append("colorEnd",         colorEnd);
    formData.append("buttonTextColor",  buttonTextColor);
    submit(formData, { method: "post" });
  }, [title, message, buttonText, textAlign, titleSize, messageSize, titleColor, messageColor, fontFamily, liquidGlass, isActive, colorStart, colorEnd, buttonTextColor, submit, allValid]);

  const previewGradient = colorStartValid && colorEndValid
    ? `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const selectedFont = FONT_OPTIONS.find(f => f.value === fontFamily)?.value ?? "inherit";

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

              {/* ── Content ── */}
              <Text variant="headingSm" as="h3">Content</Text>
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
              <TextField
                label="Button text"
                value={buttonText}
                onChange={setButtonText}
                autoComplete="off"
                placeholder="Shop Now!"
              />

              <Divider />

              {/* ── Typography ── */}
              <Text variant="headingSm" as="h3">Typography</Text>

              <Select
                label="Font family"
                options={FONT_OPTIONS}
                value={fontFamily}
                onChange={setFontFamily}
                helpText="Google Fonts (Inter, Playfair Display, Montserrat, Lato, Poppins) are loaded automatically."
              />

              <Select
                label="Text alignment"
                options={TEXT_ALIGN_OPTIONS}
                value={textAlign}
                onChange={setTextAlign}
              />

              <RangeSlider
                label={`Title size: ${titleSize}px`}
                min={14}
                max={48}
                value={titleSize}
                onChange={(val) => setTitleSize(val as number)}
                output
              />
              <RangeSlider
                label={`Message size: ${messageSize}px`}
                min={12}
                max={32}
                value={messageSize}
                onChange={(val) => setMessageSize(val as number)}
                output
              />

              <Divider />

              {/* ── Text Colors ── */}
              <Text variant="headingSm" as="h3">Text Colors</Text>
              <InlineStack gap="400" blockAlign="start">
                <div style={{ flex: 1 }}>
                  <ColorField
                    label="Title color"
                    value={titleColor}
                    onChange={setTitleColor}
                    helpText="Default: #ffffff (white on gradient header)"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <ColorField
                    label="Message color"
                    value={messageColor}
                    onChange={setMessageColor}
                    helpText="Default: #4a5568 (dark grey)"
                  />
                </div>
              </InlineStack>
              <InlineStack gap="400" blockAlign="start">
                <div style={{ flex: 1 }}>
                  <ColorField
                    label="Button text color"
                    value={buttonTextColor}
                    onChange={setButtonTextColor}
                    helpText="Default: #ffffff (white)"
                  />
                </div>
                <div style={{ flex: 1 }} />
              </InlineStack>

              {/* Live text preview */}
              <div style={{
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                fontFamily: selectedFont,
              }}>
                <div style={{ background: previewGradient, padding: "20px 24px" }}>
                  <p style={{
                    margin: 0,
                    fontSize: titleSize,
                    fontWeight: 700,
                    color: titleColorValid ? titleColor : "#ffffff",
                    textAlign: textAlign as any,
                    fontFamily: selectedFont,
                  }}>{title || "Popup title"}</p>
                </div>
                <div style={{ background: "#fff", padding: "16px 24px", borderTop: "1px solid #e5e7eb" }}>
                  <p style={{
                    margin: 0,
                    fontSize: messageSize,
                    color: msgColorValid ? messageColor : "#4a5568",
                    textAlign: textAlign as any,
                    lineHeight: 1.6,
                    fontFamily: selectedFont,
                  }}>{message || "Popup message"}</p>
                </div>
                <div style={{ background: "transparent", padding: "12px 24px 20px", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{
                    background: previewGradient,
                    borderRadius: 8,
                    padding: "10px 0",
                    textAlign: "center",
                    color: btnTextColorValid ? buttonTextColor : "#fff",
                    fontWeight: 600,
                    fontSize: 15,
                    fontFamily: selectedFont,
                  }}>{buttonText || "Shop Now!"}</div>
                </div>
              </div>

              <Divider />

              {/* ── Gradient Colors ── */}
              <Text variant="headingSm" as="h3">Gradient Colors</Text>
              <InlineStack gap="400" blockAlign="start">
                <div style={{ flex: 1 }}>
                  <ColorField label="Start color" value={colorStart} onChange={setColorStart} />
                </div>
                <div style={{ flex: 1 }}>
                  <ColorField label="End color" value={colorEnd} onChange={setColorEnd} />
                </div>
              </InlineStack>

              <Divider />

              {/* ── Style ── */}
              <Text variant="headingSm" as="h3">Style</Text>
              <Checkbox
                label="Liquid Glass effect (style iOS)"
                helpText="Applies a frosted glass look to the entire popup. The gradient becomes the background tint."
                checked={liquidGlass}
                onChange={setLiquidGlass}
              />

              <Divider />
              <InlineStack gap="300">
                <Button
                  variant={isActive ? "secondary" : "primary"}
                  tone={isActive ? "critical" : undefined}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "Disable popup" : "Enable popup"}
                </Button>
                <Button
                  variant="primary"
                  loading={isSaving}
                  onClick={handleSave}
                  disabled={!allValid}
                >
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
